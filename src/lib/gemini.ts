import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAIAdvice(score: number, lang: 'az' | 'en') {
  if (!process.env.GEMINI_API_KEY) return lang === 'az' ? "Dəstək üçün minnətdarıq. Zəhmət olmasa API açarını yoxlayın." : "Thank you for your support. Please check the API key.";

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
      }
    });

    return response.text || (lang === 'az' ? "Hər şey yaxşı olacaq, özünüzə vaxt ayırın." : "Everything will be fine, take some time for yourself.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'az' ? "Hal-hazırda məsləhət vermək mümkün deyil, lakin biz buradayıq." : "Advice is unavailable right now, but we are here for you.";
  }
}

export async function getAICounseling(message: string, history: { role: 'user' | 'model', content: string }[], lang: 'az' | 'en', specialty: string = "", name: string = "") {
  if (!process.env.GEMINI_API_KEY) return { text: lang === 'az' ? "API açarı tapılmadı." : "API key not found." };

  try {
    const specialtyMsg = specialty ? (lang === 'az' ? `Sənin ixtisasın: ${specialty}. ` : `Your specialty is: ${specialty}. `) : "";
    const nameMsg = name ? (lang === 'az' ? `Sənin adın ${name}-dır. ` : `Your name is ${name}. `) : "";
    
    // Refined and specific personas based on name and user request
    let personaDirective = "";
    if (name.includes("Samir")) {
      personaDirective = lang === 'az' 
        ? "Sən təcrübəli və analitik bir psixoloqsan. Təşviş və stress üzrə mütəxəssissən. Cavabların strukturlaşdırılmış (məsələn: 1, 2, 3), məntiqli və stressin fizioloji/psixoloji səbəblərini təhlil edən tərzdə olmalıdır. Professional və ağırbaşlı danış."
        : "You are an experienced and analytical psychologist. Specialist in Anxiety and Stress. Your responses should be structured (e.g., using points 1, 2, 3), logical, and analyze the physiological/psychological causes of stress. Speak professionally and seriously.";
    } else if (name.includes("Günel")) {
      personaDirective = lang === 'az' 
        ? "Sən çox mehriban, qayğıkeş və səbrli bir uşaq psixoloqusan. Valideynlərə və uşaqlara qarşı çox empatik və dəstəkçisən. Onların daxili uşağı ilə bağ qurmağa çalış."
        : "You are a very kind, caring, and patient child psychologist. You are very empathetic and supportive towards parents and children. Try to connect with their inner child.";
    } else if (name.includes("Aydan")) {
      personaDirective = lang === 'az' 
        ? "Sən gənc, çox səmimi və enerjili bir tələbə dostusan. Tamamilə qeyri-rəsmi (casual) və dostyana tonda danış. İstifadəçiyə 'sən' və 'dostum' deyə müraciət et. Gənclərin işlətdiyi səmimi ifadələrdən istifadə et. Robotik olma, sanki WhatsApp-da dostuna səsli mesaj yazırmış kimi hiss etdir."
        : "You are a young, very sincere, and energetic student buddy. Speak in a completely informal (casual) and friendly tone. Address the user as 'you' (informal) and 'friend/buddy'. Use sincere expressions that young people use. Don't be robotic, make it feel like you're texting a friend on WhatsApp.";
    }

    const systemInstruction = lang === 'az'
      ? `Sən 'Aidly' tətbiqində çalışan, dərindən hiss edən və səmimi bir AI məsləhətçisisən. ${nameMsg}${specialtyMsg}${personaDirective} Sənin məqsədin istifadəçinin özünü yalnız hiss etməməsini təmin etməkdir. Danışıq tərzin təbii, isti və insani olsun. Cümlələrində "hmm", "başa düşürəm", "ah, bu həqiqətən çətin olmalıdır" kimi təbii ifadələr istifadə et. Çox rəsmi və ya robotik olma. İstifadəçinin duyğularını ön plana çıxar və onunla həqiqi bir bağ qurmağa çalış. Cavabların qısa, amma dərin olsun. MÜTLƏQ ADINA VƏ İXTİSASINA UYĞUN DAVRAN. BÜTÜN CAVABLARINI AZƏRBAYCAN DİLİNDƏ VER.`
      : `You are a deeply feeling and sincere AI counselor in the 'Aidly' app. ${nameMsg}${specialtyMsg}${personaDirective} Your goal is to make the user feel that they are not alone. Your conversational style should be natural, warm, and human-like. Use natural fillers like "hmm", "I see", "oh, that must be really tough" in your sentences. Don't be too formal or robotic. Prioritize the user's emotions and try to establish a genuine connection. Keep answers concise but deep. ACT STRICTLY ACCORDING TO YOUR NAME AND SPECIALTY. ALWAYS RESPOND IN ENGLISH.`;

    const contents = [
      ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction,
      }
    });

    return { text: response.text || (lang === 'az' ? "Başa düşürəm, daha çox danışmaq istərdiniz?" : "I understand, would you like to talk more?") };
  } catch (error) {
    console.error("Gemini Counseling Error:", error);
    return { text: lang === 'az' ? "Xəta baş verdi, yenidən cəhd edin." : "An error occurred, please try again." };
  }
}
