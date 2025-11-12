'use server';

/**
 * @fileOverview AI-powered tool to analyze datasets and identify complex trends and correlations.
 *
 * - analyzeDatasetTrends - Analyzes datasets to identify trends and correlations.
 * - AnalyzeDatasetTrendsInput - The input type for the analyzeDatasetTrends function.
 * - AnalyzeDatasetTrendsOutput - The return type for the analyzeDatasetTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDatasetTrendsInputSchema = z.object({
  datasetDescription: z
    .string()
    .describe('The description of the dataset to analyze.'),
  datasetSample: z.string().describe('A sample of the dataset in CSV format.'),
});
export type AnalyzeDatasetTrendsInput = z.infer<typeof AnalyzeDatasetTrendsInputSchema>;

const AnalyzeDatasetTrendsOutputSchema = z.object({
  summary: z.string().describe('A summary of the trends and correlations identified in the dataset.'),
  insights: z.array(z.string()).describe('A list of key insights from the analysis.'),
  recommendations: z
    .string()
    .describe('Recommendations based on the identified trends and correlations.'),
});
export type AnalyzeDatasetTrendsOutput = z.infer<typeof AnalyzeDatasetTrendsOutputSchema>;

export async function analyzeDatasetTrends(input: AnalyzeDatasetTrendsInput): Promise<AnalyzeDatasetTrendsOutput> {
  return analyzeDatasetTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDatasetTrendsPrompt',
  input: {schema: AnalyzeDatasetTrendsInputSchema},
  output: {schema: AnalyzeDatasetTrendsOutputSchema},
  prompt: `You are an expert data analyst. Analyze the provided dataset description and sample to identify complex trends and correlations. Provide a summary of your findings, key insights, and recommendations.

Dataset Description: {{{datasetDescription}}}
Dataset Sample:
{{#if datasetSample}}
```csv
{{{datasetSample}}}
```
{{else}}
No sample data provided.
{{/if}}

Ensure that the output is well-structured and easy to understand.`, // Added Handlebars conditional for datasetSample
});

const analyzeDatasetTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeDatasetTrendsFlow',
    inputSchema: AnalyzeDatasetTrendsInputSchema,
    outputSchema: AnalyzeDatasetTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
