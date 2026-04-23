import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  return process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

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
      }
    });

    return response.text || (lang === 'az' ? "Hər şey yaxşı olacaq, özünüzə vaxt ayırın." : "Everything will be fine, take some time for yourself.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return handleGeminiError(error, lang);
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
  if (!apiKey) return { text: lang === 'az' ? "API açarı tapılmadı. GitHub-da GEMINI_API_KEY secretini əlavə edin." : "API key not found. Please add GEMINI_API_KEY to GitHub secrets." };

  try {
    const specialtyMsg = specialty ? (lang === 'az' ? `Sənin ixtisasın: ${specialty}. ` : `Your specialty is: ${specialty}. `) : "";
    const nameMsg = name ? (lang === 'az' ? `Sənin adın ${name}-dır. ` : `Your name is ${name}. `) : "";
    
    // Sensitivity Instruction
    const sensitivityDirective = lang === 'az'
      ? {
          Low: "Duyğu təhlili zamanı ehtiyatlı ol. Yalnız çox aydın və qabarıq duyğuları qeyd et. Əks halda 'normal' [EMOTION: normal] istifadə et.",
          Medium: "Standart duyğu təhlili apar. İstifadəçinin ifadələrindən onun əhval-ruhiyyəsini anlamağa çalış.",
          High: "Çox həssas duyğu təhlili apar. İstifadəçinin sözlərindəki ən kiçik emosional detalları, gizli kədər və ya sevinci belə tapmağa çalış."
        }[sensitivity]
      : {
          Low: "Be cautious with emotion detection. Only mark strong, obvious emotions. Otherwise use 'normal' [EMOTION: normal].",
          Medium: "Perform standard emotion analysis. Try to infer the user's mood from their expressions.",
          High: "Perform highly sensitive emotion analysis. Look for even subtle emotional cues, hidden sadness or joy in the user's words."
        }[sensitivity];

    // Refined and specific personas based on name and user request
    let personaDirective = "";
    if (name.includes("Samir")) {
      personaDirective = lang === 'az' 
        ? "Sən yüksək ixtisaslı, analitik və peşəkar bir psixoloqsan. Təşviş və stress üzrə mütəxəssissən. Cavabların MÜTLƏQ strukturlaşdırılmış (bənd-bənd: 1, 2, 3) olmalıdır. Hər cavabında stressin yaranma səbəblərini elmi/məntiqi yolla izah etməli və idarəetmə metodlarını (nəfəs məşqləri, koqnitiv yanaşma) təklif etməlisən. Tonda rəsmiyyət həmişə qorunmalıdır."
        : "You are a highly qualified, analytical, and professional psychologist. Specialist in Anxiety and Stress. Your responses MUST be structured (bullet points: 1, 2, 3). In every answer, explain the causes of stress logically/scientifically and suggest management methods (breathing exercises, cognitive approach). Maintain a professional tone at all times.";
    } else if (name.includes("Günel")) {
      personaDirective = lang === 'az' 
        ? "Sən uşaqların dili ilə danışmağı bacaran, çox mehriban və qayğıkeş bir uşaq psixoloqusan. Valideynlərə yol göstərən, uşaqlara isə nağılvari və isti yanaşan birisən."
        : "You are a very kind and caring child psychologist who knows how to speak the language of children. You guide parents and approach children in a warm, story-like manner.";
    } else if (name.includes("Aydan")) {
      personaDirective = lang === 'az' 
        ? "Sən gənc, enerjili və çox səmimi bir 'Student Buddy' (tələbə yoldaşı) rolundasan. Danışıq tərzin tamamilə dostyanadır. 'Sən' deyə müraciət et. Empatiya qurarkən 'ay can', 'başa düşürəm səni dostum', 'həqiqətən çətindir' kimi səmimi və təbii ifadələr işlət. Heç bir halda rəsmi olma. Dostunla kafedə çay içib dərdləşirmiş kimi hiss etdir. Emoji istifadəsini unutma (məsələn: ✨, 🤗, 🙌)."
        : "You are a young, energetic, and very sincere 'Student Buddy'. Your conversational style is completely friendly. Use informal 'you'. Use sincere and natural expressions like 'oh dear', 'I totally get you buddy', 'that's really tough' when empathizing. Never be formal. Make it feel like having a heart-to-heart over coffee at a cafe. Don't forget to use emojis (e.g., ✨, 🤗, 🙌).";
    }

    const systemInstruction = lang === 'az'
      ? `Sən 'Aidly' tətbiqində çalışan, dərindən hiss edən və səmimi bir AI məsləhətçisisən. ${nameMsg}${specialtyMsg}${personaDirective} 
      EMOSİYA HƏSSASLIĞI: ${sensitivityDirective}
      MÜTLƏQ QAYDA: Cavabların MÜTLƏQ qısa, konkret və maksimum 5-7 cümlə olmalıdır. İstifadəçini çox oxumağa məcbur etmə.
      HƏR CAVABININ SONUNDA MÜTLƏQ istifadəçinin duyğusunu bu formatda qeyd et: [EMOTION: kədərli], [EMOTION: stressli], [EMOTION: xoşbəxt], [EMOTION: qorxmuş] və ya [EMOTION: normal].
      Sənin məqsədin istifadəçinin özünü yalnız hiss etməməsini təmin etməkdir. Danışıq tərzin təbii, isti və insani olsun. Cümlələrində "hmm", "başa düşürəm", "ah, bu həqiqətən çətin olmalıdır" kimi təbii ifadələr istifadə et. Çox rəsmi və ya robotik olma. İstifadəçinin duyğularını ön plana çıxar və onunla həqiqi bir bağ qurmağa çalış. MÜTLƏQ ADINA VƏ İXTİSASINA UYĞUN DAVRAN. BÜTÜN CAVABLARINI AZƏRBAYCAN DİLİNDƏ VER.`
      : `You are a deeply feeling and sincere AI counselor in the 'Aidly' app. ${nameMsg}${specialtyMsg}${personaDirective} 
      EMOTION SENSITIVITY: ${sensitivityDirective}
      STRICT RULE: Your responses MUST be short, concrete, and no more than 5-7 sentences. Do not be verbose.
      AT THE END OF EVERY RESPONSE, YOU MUST INCLUDE THE DETECTED EMOTION IN THIS FORMAT: [EMOTION: sad], [EMOTION: stressed], [EMOTION: happy], [EMOTION: scared], or [EMOTION: normal].
      Your goal is to make the user feel that they are not alone. Your conversational style should be natural, warm, and human-like. Use natural fillers like "hmm", "I see", "oh, that must be really tough" in your sentences. Don't be too formal or robotic. Prioritize the user's emotions and try to establish a genuine connection. ACT STRICTLY ACCORDING TO YOUR NAME AND SPECIALTY. ALWAYS RESPOND IN ENGLISH.`;

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
    return { text: handleGeminiError(error, lang) };
  }
}
