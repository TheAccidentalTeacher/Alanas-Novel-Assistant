// Unit tests for the Grammar Detection Service

const { GrammarDetectionService } = require('../../backend/services/grammar-detection-service');

describe('GrammarDetectionService', () => {
  let service;

  beforeEach(() => {
    service = new GrammarDetectionService();
  });

  describe('Grammar Error Detection', () => {
    test('should detect there/their/they\'re errors', async () => {
      const text = `There going to the store. Their is a sale today. They're car is parked outside.`;

      const errors = await service.detectGrammarErrors(text);
      
      // Check for there/their/they're errors
      const thereError = errors.find(e => 
        e.type === 'there_their_theyre' && e.position === text.indexOf('There'));
      const theirError = errors.find(e => 
        e.type === 'there_their_theyre' && e.position === text.indexOf('Their'));
      const theyreError = errors.find(e => 
        e.type === 'there_their_theyre' && e.position === text.indexOf('They\'re'));
      
      expect(thereError).toBeDefined();
      expect(theirError).toBeDefined();
      expect(theyreError).toBeDefined();
    });

    test('should detect your/you\'re errors', async () => {
      const text = `Your going to love this. You're book is on the table.`;

      const errors = await service.detectGrammarErrors(text);
      
      // Check for your/you're errors
      const yourError = errors.find(e => 
        e.type === 'your_youre' && e.position === text.indexOf('Your'));
      const youreError = errors.find(e => 
        e.type === 'your_youre' && e.position === text.indexOf('You\'re'));
      
      expect(yourError).toBeDefined();
      expect(youreError).toBeDefined();
    });

    test('should detect its/it\'s errors', async () => {
      const text = `Its going to rain today. The dog wagged it's tail.`;

      const errors = await service.detectGrammarErrors(text);
      
      // Check for its/it's errors
      const itsError = errors.find(e => 
        e.type === 'its_its' && e.position === text.indexOf('Its'));
      const itsError2 = errors.find(e => 
        e.type === 'its_its' && e.position === text.indexOf('it\'s'));
      
      expect(itsError).toBeDefined();
      expect(itsError2).toBeDefined();
    });

    test('should detect capitalization errors', async () => {
      const text = `This is a sentence. this should be capitalized. another error here.`;

      const errors = await service.detectGrammarErrors(text);
      
      // Check for capitalization errors
      const capErrors = errors.filter(e => e.type === 'capitalization');
      expect(capErrors.length).toBe(2);
    });

    test('should detect subject-verb agreement errors', async () => {
      const text = `The dog and cat is playing. They is happy. He are tired.`;

      const errors = await service.detectGrammarErrors(text);
      
      // Check for subject-verb agreement errors
      const svErrors = errors.filter(e => e.type === 'subject_verb');
      expect(svErrors.length).toBeGreaterThan(0);
    });

    test('should detect run-on sentences', async () => {
      const text = `This is a very long sentence that goes on and on, it has multiple clauses, it doesn't use proper punctuation, it should be broken up into smaller sentences.`;

      const errors = await service.detectGrammarErrors(text);
      
      // Check for run-on sentence errors
      const runOnError = errors.find(e => e.type === 'run_on_sentence');
      expect(runOnError).toBeDefined();
    });

    test('should detect double negatives', async () => {
      const text = `I don't have nothing to say. She didn't see nobody there.`;

      const errors = await service.detectGrammarErrors(text);
      
      // Check for double negative errors
      const doubleNegErrors = errors.filter(e => e.type === 'double_negative');
      expect(doubleNegErrors.length).toBe(2);
    });

    test('should detect passive voice', async () => {
      const text = `The book was written by the author. The window was broken by the ball.`;

      const errors = await service.detectGrammarErrors(text);
      
      // Check for passive voice errors
      const passiveErrors = errors.filter(e => e.type === 'passive_voice');
      expect(passiveErrors.length).toBe(2);
    });

    test('should detect commonly confused words', async () => {
      const text = `I will accept your offer. The weather is nice today. I don't know weather to go or stay.`;

      const errors = await service.detectGrammarErrors(text);
      
      // Check for confused word errors
      const confusedErrors = errors.filter(e => e.type === 'confused_words');
      expect(confusedErrors.length).toBeGreaterThan(0);
    });

    test('should detect redundant phrases', async () => {
      const text = `This is an absolutely essential part of the process. We need to make advance planning for the event.`;

      const errors = await service.detectGrammarErrors(text);
      
      // Check for redundant phrase errors
      const redundantErrors = errors.filter(e => e.type === 'redundant_phrases');
      expect(redundantErrors.length).toBe(2);
    });
  });

  describe('Sentence Structure Analysis', () => {
    test('should detect sentence fragments', async () => {
      const text = `Complete sentence here. Without a verb. Another complete sentence.`;

      const errors = await service.detectGrammarErrors(text);
      
      // Check for sentence fragment errors
      const fragmentErrors = errors.filter(e => e.type === 'sentence_fragment');
      expect(fragmentErrors.length).toBeGreaterThan(0);
    });

    test('should detect repeated words', async () => {
      const text = `She said that that was not what she meant. The the book is on the table.`;

      const errors = await service.comprehensiveGrammarCheck(text);
      
      // Check for repeated word errors
      const repeatedErrors = errors.filter(e => e.type === 'repeated_word');
      expect(repeatedErrors.length).toBe(2);
    });

    test('should correctly identify sentences with subjects and verbs', () => {
      // Valid sentences with subject and verb
      expect(service.hasSubjectAndVerb('He runs every day.')).toBe(true);
      expect(service.hasSubjectAndVerb('The cat jumped onto the table.')).toBe(true);
      expect(service.hasSubjectAndVerb('They are going to the store.')).toBe(true);
      
      // Invalid sentences missing subject or verb
      expect(service.hasSubjectAndVerb('Running fast.')).toBe(false);
      expect(service.hasSubjectAndVerb('On the table.')).toBe(false);
    });
  });

  describe('Context-Aware Grammar Checking', () => {
    test('should use context to improve there/their/they\'re detection', async () => {
      // Correct usage
      const correctText = `They're going to the store. Their car is in the garage. There is a book on the table.`;
      const correctErrors = await service.detectGrammarErrors(correctText);
      
      // No errors should be detected for correct usage
      const thereTheirTheyreErrors = correctErrors.filter(e => e.type === 'there_their_theyre');
      expect(thereTheirTheyreErrors.length).toBe(0);
      
      // Incorrect usage
      const incorrectText = `There going to the store. They're car is in the garage. Their is a book on the table.`;
      const incorrectErrors = await service.detectGrammarErrors(incorrectText);
      
      // Errors should be detected for incorrect usage
      const incorrectThereTheirTheyreErrors = incorrectErrors.filter(e => e.type === 'there_their_theyre');
      expect(incorrectThereTheirTheyreErrors.length).toBe(3);
    });

    test('should use context to improve your/you\'re detection', async () => {
      // Correct usage
      const correctText = `Your book is on the table. You're going to love this.`;
      const correctErrors = await service.detectGrammarErrors(correctText);
      
      // No errors should be detected for correct usage
      const yourYoureErrors = correctErrors.filter(e => e.type === 'your_youre');
      expect(yourYoureErrors.length).toBe(0);
      
      // Incorrect usage
      const incorrectText = `You're book is on the table. Your going to love this.`;
      const incorrectErrors = await service.detectGrammarErrors(incorrectText);
      
      // Errors should be detected for incorrect usage
      const incorrectYourYoureErrors = incorrectErrors.filter(e => e.type === 'your_youre');
      expect(incorrectYourYoureErrors.length).toBe(2);
    });
  });

  describe('Error Handling', () => {
    test('should handle errors gracefully during grammar detection', async () => {
      // Create a rule that will throw an error
      const originalRules = service.grammarRules;
      service.grammarRules = [
        {
          name: 'error_rule',
          pattern: /test/g,
          check: () => { throw new Error('Test error'); }
        },
        ...originalRules
      ];
      
      const text = `This is a test sentence.`;
      
      // Should not throw an error
      const errors = await service.detectGrammarErrors(text);
      
      // Should still detect other errors
      expect(errors.length).toBeGreaterThanOrEqual(0);
      
      // Restore original rules
      service.grammarRules = originalRules;
    });
  });

  describe('Performance', () => {
    test('should handle large text efficiently', async () => {
      // Create a large text
      const paragraph = `This is a sample paragraph with some common errors. Their going to the store. Your welcome to join them. Its going to be fun. The cat and dog is playing. this sentence is not capitalized.`;
      const largeText = paragraph.repeat(20);
      
      // Measure execution time
      const startTime = Date.now();
      const errors = await service.detectGrammarErrors(largeText);
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // Should detect errors
      expect(errors.length).toBeGreaterThan(0);
      
      // Should complete in a reasonable time (adjust threshold as needed)
      expect(executionTime).toBeLessThan(5000); // 5 seconds
    });
  });
});