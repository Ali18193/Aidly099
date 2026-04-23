import Anthropic from "@anthropic-ai/sdk";

const getApiKey = () => {
    return process.env.CLAUDE_API_KEY || (import.meta as any).env?.VITE_CLAUDE_API_KEY || "";
};

const apiKey = getApiKey();
const anthropic = new Anthropic({
    apiKey: apiKey,
    // We enable this because we are running in a client-side environment (Capacitor/Vite)
    // and the user explicitly wants to use their own key.
    dangerouslyAllowBrowser: true 
});

function handleClaudeError(error: any, lang: 'az' | 'en'): string {
    const errMessage = error?.message?.toLowerCase() || "";
    
    if (errMessage.includes("overloaded") || errMessage.includes("rate_limit")) {
        return lang === 'az'
            ? "Claude hazırda çox məşğuldur! Bir neçə dəqiqə sonra yenidən cəhd edin."
            : "Claude is currently overloaded! Please try again in a few minutes.";
    }
    
    if (errMessage.includes("api_key") || !apiKey) {
        return lang === 'az'
            ? "Claude API açarı tapılmadı və ya səhvdir. Zəhmət olmasa CLAUDE_API_KEY sirrini yoxlayın."
            : "Claude API key is missing or invalid. Please check your CLAUDE_API_KEY secret.";
    }

    return lang === 'az'
        ? "Claude ilə əlaqə zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."
        : "An error occurred while connecting to Claude. Please try again.";
}

export async function getAIAdvice(score: number, lang: 'az' | 'en') {
    if (!apiKey) return lang === 'az' ? "Dəstək üçün minnətdarıq. API açarı (Claude) yoxdur." : "Thanks for support. Claude API key is missing.";

    try {
        const system = lang === 'az'
            ? "Sən 'Aidly' tətbiqində çalışan səmimi bir AI-san. İstifdəçiyə testi üçün qısa, isti və ürəkdən gələn cümlələrlə dəstək olmalısan. MÜTLƏQ AZƏRBAYCAN DİLİNDƏ CAVAB VER."
            : "You are a warm AI in the 'Aidly' app. Support the user for their test result with short, heartfelt sentences. ALWAYS RESPOND IN ENGLISH.";

        const prompt = lang === 'az' 
            ? `İstifadəçi psixoloji testdən 100 üzərindən ${score} bal topladı. Çox səmimi bir dəstək mesajı yaz. Maksimum 2 cümlə.`
            : `The user scored ${score} out of 100 on a psychological test. Write a sincere, warm support message. Maximum 2 sentences.`;

        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 1024,
            system: system,
            messages: [{ role: "user", content: prompt }],
        });

        const textContent = response.content[0].type === 'text' ? response.content[0].text : "";
        return textContent || (lang === 'az' ? "Hər şey yaxşı olacaq." : "Everything will be fine.");
    } catch (error) {
        console.error("Claude Advice Error:", error);
        return handleClaudeError(error, lang);
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
    if (!apiKey) return { text: lang === 'az' ? "Claude API açarı tapılmadı." : "Claude API key not found." };

    try {
        const specialtyMsg = specialty ? (lang === 'az' ? `Sənin ixtisasın: ${specialty}. ` : `Your specialty is: ${specialty}. `) : "";
        const nameMsg = name ? (lang === 'az' ? `Sənin adın ${name}-dır. ` : `Your name is ${name}. `) : "";
        
        const sensitivityDirective = lang === 'az'
          ? {
              Low: "Duyğu təhlili zamanı ehtiyatlı ol. Yalnız çox aydın duyğuları [EMOTION: ...] formatında qeyd et.",
              Medium: "Standart duyğu təhlili apar.",
              High: "Çox həssas duyğu təhlili apar."
            }[sensitivity]
          : {
              Low: "Be cautious with emotion detection.",
              Medium: "Perform standard emotion analysis.",
              High: "Perform highly sensitive emotion analysis."
            }[sensitivity];

        const system = lang === 'az'
            ? `Sən 'Aidly' tətbiqində səmimi AI məsləhətçisən. ${nameMsg}${specialtyMsg} EMOSİYA HƏSSASLIĞI: ${sensitivityDirective} Cavabın qısa (maks 5-7 cümlə) olsun. SONDA MÜTLƏQ: [EMOTION: duyğu] formatında duyğunu yaz. MÜTLƏQ AZƏRBAYCAN DİLİNDƏ CAVAB VER.`
            : `You are a sincere AI counselor in the 'Aidly' app. ${nameMsg}${specialtyMsg} EMOTION SENSITIVITY: ${sensitivityDirective} Keep responses short (max 5-7 sentences). AT THE END: include [EMOTION: emotion]. ALWAYS RESPOND IN ENGLISH.`;

        const claudeHistory: any[] = history.map(h => ({
            role: h.role === 'user' ? 'user' : 'assistant',
            content: h.content
        }));

        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 1024,
            system: system,
            messages: [...claudeHistory, { role: "user", content: message }],
        });

        const textContent = response.content[0].type === 'text' ? response.content[0].text : "";
        return { text: textContent || (lang === 'az' ? "Sizi dinləyirəm." : "I am listening.") };
    } catch (error) {
        console.error("Claude Counseling Error:", error);
        return { text: handleClaudeError(error, lang) };
    }
}
