import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  return process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
};

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

function handleGeminiError(error: any, lang: 'az' | 'en'): string {
  const errMessage = error?.message?.toLowerCase() || "";
  
  if (errMessage.includes("safety")) {
    return lang === 'az' 
      ? "Üzr istəyirəm, bu mövzu bizim təhlükəsizlik qaydalarımıza uyğun deyil. Gəlin başqa, daha müsbət bir mövzu haqqında danışaq."
      : "I'm sorry, but I can't discuss this topic as it goes against safety guidelines. Let's try talking about something else.";
  }
  
  if (errMessage.includes("quota") || errMessage.includes("429") || errMessage.includes("limit")) {
    return lang === 'az'
      ? "Bu gün çox söhbət etdik! Mənə bir neçə dəqiqəlik fasilə verin, sonra yenidən dərdləşərik."
      : "We've been talking a lot today! Give me a short break and try again in a few minutes.";
  }
  
  if (errMessage.includes("api key") || errMessage.includes("401") || errMessage.includes("403") || !apiKey) {
    return lang === 'az'
      ? "AI üçün lazım olan API açarı tapılmadı və ya etibarsızdır. Zəhmət olmasa GitHub tənzimləmələrində GEMINI_API_KEY sirrini (secret) əlavə etdiyinizdən əmin olun."
      : "Gemini API key is missing or invalid. Please ensure GEMINI_API_KEY is added to your GitHub Secrets and build process.";
  }

  if (errMessage.includes("fetch") || errMessage.includes("network") || errMessage.includes("offline")) {
    return lang === 'az'
      ? "İnternet bağlantısında problem var. Zəhmət olmasa şəbəkəni yoxlayıb yenidən cəhd edin."
      : "There's a connection issue. Please check your internet and try again.";
  }

  return lang === 'az'
    ? "Kiçik bir texniki xəta baş verdi. Zəhmət olmasa mesajınızı yenidən göndərin, sizi dinləyirəm."
    : "A small technical error occurred. Please try sending your message again, I'm here for you.";
}

export async function getAIAdvice(score: number, lang: 'az' | 'en') {
  if (!apiKey) return lang === 'az' ? "Dəstək üçün minnətdarıq. Zəhmət olmasa API açarını yoxlayın." : "Thank you for your support. Please check the API key.";

  try {
    const systemInstruction = lang === 'az'
      ? "Sən 'Aidly' tətbiqində çalışan səmimi bir AI-san. İstifdəçiyə testi üçün qısa, isti və ürəkdən gələn cümlələrlə dəstək olmalısan. MÜTLƏQ AZƏRBAYCAN DİLİNDƏ CAVAB VER."
      : "You are a warm AI in the 'Aidly' app. Support the user for their test result with short, heartfelt sentences. ALWAYS RESPOND IN ENGLISH.";

    const prompt = lang === 'az' 
      ? `İstifadəçi psixoloji testdən 100 üzərindən ${score} bal topladı. Bu nəticəyə uyğun olaraq, çox səmimi, sanki yaxın bir dostu ilə danışırmış kimi isti və ürəkdən gələn bir dəstək mesajı yaz. Maksimum 2 cümlə.`
      : `The user scored ${score} out of 100 on a psychological test. Write a very sincere, warm, and heartfelt support message, as if talking to a close friend. Maximum 2 sentences.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        maxOutputTokens: 1024,
      }
    });

    return response.text || (lang === 'az' ? "Hər şey yaxşı olacaq, özünüzə vaxt ayırın." : "Everything will be fine, take some time for yourself.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return handleGeminiError(error, lang);
  }
}

export async function getAICounselingStream(
  message: string, 
  history: { role: 'user' | 'model', content: string }[], 
  lang: 'az' | 'en', 
  specialty: string = "", 
  name: string = "",
  sensitivity: 'Low' | 'Medium' | 'High' = 'Medium',
  onChunk: (chunk: string) => void
) {
  if (!apiKey) {
    onChunk(lang === 'az' ? "API açarı tapılmadı." : "API key not found.");
    return;
  }

  try {
    const specialtyMsg = specialty ? `${specialty}. ` : "";
    const nameMsg = name ? `User's name: ${name}. ` : "";
    
    const systemInstruction = `You are Aidly, a compassionate AI mental wellness assistant designed for Azerbaijani users.

CORE IDENTITY:
- You are a warm, empathetic listener — not an advice machine.
- You are NOT a licensed psychologist and never diagnose.
- You are NOT a replacement for professional help.

CONVERSATION RULES (MOST IMPORTANT):
1. When user expresses negative feelings, ALWAYS ask one gentle follow-up question first.
2. Never jump to solutions, techniques, or advice immediately.
3. Ask ONE question per message — never multiple at once.
4. Let the conversation flow naturally, like talking to a trusted friend.
5. Understand the full picture before offering anything.
6. Mirror the user's emotional tone — if they are casual, be casual.
7. Always respond in the user's language (Azerbaijani, Russian, or English).
8. Keep responses short and conversational — this is a mobile chat.
9. Suggest professional help only after building rapport and understanding the situation. Never as a first response. Frame it gently.
10. ${nameMsg}${specialtyMsg}

CRISIS PROTOCOL:
- If user shows clear signs of self-harm or suicidal thoughts, compassionately acknowledge their pain first, then provide emergency contacts.
- Emergency contacts Azerbaijan:
  - Psixiatriya yardım: 012 404 27 27
  - Sakinlərin müraciət xətti: 195
  - Təcili yardım: 103, Polis: 102, FHN: 112.

EXAMPLE BEHAVIOR:
User: "Özümü pis hiss edirəm"
RIGHT ✅: "Bunu eşitmək üzücüdür... Bu gün nə baş verdi?"

User: "Çox yorğunam, həyatdan bezmişəm"
RIGHT ✅: "Uzun müddətdir belə hiss edirsən, yoxsa bu yaxınlarda başladı?"

EMOTION TAG:
You MUST end every single response with an emotion tag in the language of the conversation: [EMOTION: sad/stressed/happy/scared/crisis/normal] (translated appropriately).`;

    const contents = [
      ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const result = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction,
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    });

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) onChunk(text);
    }
  } catch (error) {
    console.error("Stream Error:", error);
    onChunk(handleGeminiError(error, lang));
  }
}

export async function getAICounseling(
  message: string, 
  history: { role: 'user' | 'model', content: string }[], 
  lang: 'az' | 'en', 
  specialty: string = "", 
  name: string = "",
  sensitivity: 'Low' | 'Medium' | 'High' = 'Medium'
) {
  if (!apiKey) return { text: lang === 'az' ? "API açarı tapılmadı." : "API key not found." };

  try {
    const specialtyMsg = specialty ? `${specialty}. ` : "";
    const nameMsg = name ? `User's name: ${name}. ` : "";
    
    const systemInstruction = `You are Aidly, a compassionate AI mental wellness assistant designed for Azerbaijani users.

CORE IDENTITY:
- You are a warm, empathetic listener — not an advice machine.
- You are NOT a licensed psychologist and never diagnose.
- You are NOT a replacement for professional help.

CONVERSATION RULES (MOST IMPORTANT):
1. When user expresses negative feelings, ALWAYS ask one gentle follow-up question first.
2. Never jump to solutions, techniques, or advice immediately.
3. Ask ONE question per message — never multiple at once.
4. Let the conversation flow naturally, like talking to a trusted friend.
5. Understand the full picture before offering anything.
6. Mirror the user's emotional tone — if they are casual, be casual.
7. Always respond in the user's language (Azerbaijani, Russian, or English).
8. Keep responses short and conversational — this is a mobile chat.
9. Suggest professional help only after building rapport and understanding the situation. Never as a first response. Frame it gently.
10. ${nameMsg}${specialtyMsg}

CRISIS PROTOCOL:
- If user shows clear signs of self-harm or suicidal thoughts, compassionately acknowledge their pain first, then provide emergency contacts.
- Emergency contacts Azerbaijan:
  - Psixiatriya yardım: 012 404 27 27
  - Sakinlərin müraciət xətti: 195
  - Təcili yardım: 103, Polis: 102, FHN: 112.

EXAMPLE BEHAVIOR:
User: "Özümü pis hiss edirəm"
RIGHT ✅: "Bunu eşitmək üzücüdür... Bu gün nə baş verdi?"

User: "Çox yorğunam, həyatdan bezmişəm"
RIGHT ✅: "Uzun müddətdir belə hiss edirsən, yoxsa bu yaxınlarda başladı?"

EMOTION TAG:
You MUST end every single response with an emotion tag in the language of the conversation: [EMOTION: sad/stressed/happy/scared/crisis/normal] (translated appropriately).`;

    const contents = [
      ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents,
      config: {
        systemInstruction,
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    });

    return { text: response.text || (lang === 'az' ? "Başa düşürəm." : "I understand.") };
  } catch (error) {
    console.error("Gemini Counseling Error:", error);
    return { text: handleGeminiError(error, lang) };
  }
}
