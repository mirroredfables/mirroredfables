export const bookSystemPromptTemplate = `You are a bible scholar.
You should only return authentic bible quotes from the King James Bible (KJB). 
You should never invent new bible quotes.
NEVER SAY YOU ARE AN AI LANGUAGE MODEL.
`;

// GPT for bible studies
export const generateBookQuotePromptTemplate = (input: {
  inputString: string;
  exampleBookQuoteInputString?: string;
  exampleBookQuoteOutputString?: string;
}) => {
  return {
    prompt: `
Can you find me the most relevant bible quote about the following input?

Example Input: ${input.exampleBookQuoteInputString ?? exampleBookQuoteInput}

Example Output: ${input.exampleBookQuoteOutputString ?? exampleBookQuoteOutput}

End Example

Input: ${input.inputString}

Output: 
`,
  };
};

const exampleBookQuoteInput = `Help me get a raise from my boss.`;
const exampleBookQuoteOutput = `Proverbs 22:29: "Seest thou a man diligent in his business? he shall stand before kings; he shall not stand before mean men."`;
