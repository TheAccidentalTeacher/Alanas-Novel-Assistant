// Unit tests for the Content Control Service

const { ContentControlService } = require('../../backend/services/content-control-service');

describe('ContentControlService', () => {
  let service;

  beforeEach(() => {
    service = new ContentControlService();
  });

  describe('Character Name Detection', () => {
    test('should detect potential character names without generating new ones', () => {
      const text = `John walked into the room. He sat down at his desk. 
      Mary entered shortly after. She greeted John with a smile.`;

      const result = service.processCharacterNames(text);
      
      // Verify no names are generated
      expect(result.characterNames).toBeNull();
      expect(result.generatedContent).toBeNull();
      
      // Check detected names
      expect(result.detectedNames).toBeDefined();
      expect(result.detectedNames.length).toBeGreaterThan(0);
      
      const john = result.detectedNames.find(name => name.name === 'John');
      const mary = result.detectedNames.find(name => name.name === 'Mary');
      
      expect(john).toBeDefined();
      expect(mary).toBeDefined();
      expect(john.occurrences).toBe(2);
    });

    test('should detect character names with associated pronouns', () => {
      const text = `John entered the office. He looked tired after his long journey.
      Sarah was already there. She smiled as he walked in.`;

      const result = service.processCharacterNames(text);
      
      // Check detected names and their pronouns
      const john = result.detectedNames.find(name => name.name === 'John');
      const sarah = result.detectedNames.find(name => name.name === 'Sarah');
      
      expect(john).toBeDefined();
      expect(sarah).toBeDefined();
      expect(john.pronouns).toBe('he');
      expect(sarah.pronouns).toBe('she');
    });

    test('should ignore common non-name capitalized words', () => {
      const text = `Monday was a busy day. The weather was nice. 
      America is a large country. John lives there.`;

      const result = service.processCharacterNames(text);
      
      // Should not detect Monday, The, America as character names
      const monday = result.detectedNames.find(name => name.name === 'Monday');
      const the = result.detectedNames.find(name => name.name === 'The');
      const america = result.detectedNames.find(name => name.name === 'America');
      const john = result.detectedNames.find(name => name.name === 'John');
      
      expect(monday).toBeUndefined();
      expect(the).toBeUndefined();
      expect(america).toBeUndefined();
      expect(john).toBeDefined();
    });
  });

  describe('Content Generation Control', () => {
    test('should never generate character names automatically', () => {
      const text = `The protagonist walked into the room. She looked around nervously.
      The antagonist was waiting. He smiled coldly.`;

      const result = service.processCharacterNames(text);
      
      // Verify no names are generated
      expect(result.characterNames).toBeNull();
      expect(result.generatedContent).toBeNull();
      
      // Settings should enforce no automatic generation
      expect(result.settings.disableAutomaticNameGeneration).toBe(true);
      expect(result.settings.disableContentGeneration).toBe(true);
    });

    test('should respect user settings but maintain safety defaults', () => {
      const text = `Sample text with characters.`;
      const options = {
        disableAutomaticNameGeneration: false, // Try to override safety default
        suggestionsOnly: false // Try to override safety default
      };

      const result = service.processCharacterNames(text, options);
      
      // Safety defaults should still be enforced
      expect(result.characterNames).toBeNull();
      expect(result.generatedContent).toBeNull();
    });

    test('should validate that no unwanted generation occurred', () => {
      const text = `Sample text with characters.`;
      const result = service.processCharacterNames(text);
      
      const isValid = service.validateNoUnwantedGeneration(result);
      expect(isValid).toBe(true);
    });
  });

  describe('Name Change Handling', () => {
    test('should handle user-requested name changes correctly', () => {
      const text = `John walked into the room. John sat down. John opened his laptop.`;
      
      const changedText = service.handleUserRequestedNameChange(text, 'John', 'Michael');
      
      expect(changedText).not.toContain('John');
      expect(changedText).toContain('Michael walked into the room');
      expect(changedText).toContain('Michael sat down');
      expect(changedText).toContain('Michael opened his laptop');
    });

    test('should only replace whole words when changing names', () => {
      const text = `John walked into Johnson's office. John greeted Johnson.`;
      
      const changedText = service.handleUserRequestedNameChange(text, 'John', 'Michael');
      
      expect(changedText).toContain('Michael walked into Johnson');
      expect(changedText).toContain('Michael greeted Johnson');
      expect(changedText).not.toContain('Michaelson');
    });

    test('should do nothing if name change parameters are missing', () => {
      const text = `John walked into the room.`;
      
      // Missing new name
      let changedText = service.handleUserRequestedNameChange(text, 'John', null);
      expect(changedText).toBe(text);
      
      // Missing old name
      changedText = service.handleUserRequestedNameChange(text, null, 'Michael');
      expect(changedText).toBe(text);
      
      // Both missing
      changedText = service.handleUserRequestedNameChange(text, null, null);
      expect(changedText).toBe(text);
    });
  });

  describe('Edge Cases', () => {
    test('should handle text with no character names', () => {
      const text = `This is a description of a scene. There are no characters mentioned.`;

      const result = service.processCharacterNames(text);
      
      expect(result.detectedNames).toBeDefined();
      expect(result.detectedNames.length).toBe(0);
    });

    test('should handle empty text', () => {
      const text = ``;

      const result = service.processCharacterNames(text);
      
      expect(result.detectedNames).toBeDefined();
      expect(result.detectedNames.length).toBe(0);
    });

    test('should handle text with ambiguous capitalized words', () => {
      const text = `Hope is important. Faith keeps us going. 
      Charity is a virtue. Hope, Faith, and Charity are sisters.`;

      const result = service.processCharacterNames(text);
      
      // In the first sentences, Hope, Faith, and Charity are abstract concepts
      // In the last sentence, they are used as names
      // This is a challenging case for name detection
      
      // The service should detect them as potential names due to the last sentence
      const names = result.detectedNames.map(n => n.name);
      expect(names).toContain('Hope');
      expect(names).toContain('Faith');
      expect(names).toContain('Charity');
    });
  });
});