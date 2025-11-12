'use server';

/**
 * @fileOverview Summarizes a dataset using AI.
 *
 * - generateDatasetSummary - A function that generates a summary of a dataset.
 * - GenerateDatasetSummaryInput - The input type for the generateDatasetSummary function.
 * - GenerateDatasetSummaryOutput - The return type for the generateDatasetSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDatasetSummaryInputSchema = z.object({
  datasetDescription: z
    .string()
    .describe('A description of the dataset to be summarized.'),
});
export type GenerateDatasetSummaryInput = z.infer<typeof GenerateDatasetSummaryInputSchema>;

const GenerateDatasetSummaryOutputSchema = z.object({
  summary: z.string().describe('A short summary of the dataset.'),
});
export type GenerateDatasetSummaryOutput = z.infer<typeof GenerateDatasetSummaryOutputSchema>;

export async function generateDatasetSummary(
  input: GenerateDatasetSummaryInput
): Promise<GenerateDatasetSummaryOutput> {
  return generateDatasetSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDatasetSummaryPrompt',
  input: {schema: GenerateDatasetSummaryInputSchema},
  output: {schema: GenerateDatasetSummaryOutputSchema},
  prompt: `You are an AI assistant helping a busy executive understand datasets quickly.

  Generate a concise summary of the following dataset description. Focus on key findings and trends.

  Dataset Description: {{{datasetDescription}}}
  `,
});

const generateDatasetSummaryFlow = ai.defineFlow(
  {
    name: 'generateDatasetSummaryFlow',
    inputSchema: GenerateDatasetSummaryInputSchema,
    outputSchema: GenerateDatasetSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
