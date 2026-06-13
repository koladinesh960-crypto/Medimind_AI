const RED_FLAG_PATTERNS = [
  {
    keywords: ['chest pain', 'shortness of breath'],
    condition: 'Possible cardiac emergency',
    severity: 'critical',
    guidance: 'Call 911 (or your local emergency number) immediately. Do not drive yourself. Chew an aspirin if not allergic while waiting for help.',
  },
  {
    keywords: ['chest pain', 'arm pain'],
    condition: 'Possible heart attack',
    severity: 'critical',
    guidance: 'Call 911 immediately. Sit or lie down. Chew an aspirin (325mg) if not allergic.',
  },
  {
    keywords: ['facial drooping', 'arm weakness', 'slurred speech'],
    condition: 'Possible stroke (FAST signs)',
    severity: 'critical',
    guidance: 'Call 911 immediately. Note the time symptoms started. Do not give food or drink.',
    matchAny: true,
  },
  {
    keywords: ['sudden numbness', 'one side'],
    condition: 'Possible stroke',
    severity: 'critical',
    guidance: 'Call 911 immediately. Use FAST: Face drooping, Arm weakness, Speech difficulty, Time to call.',
  },
  {
    keywords: ['severe allergic', 'throat swelling', 'anaphylaxis', 'can\'t breathe', 'cannot breathe'],
    condition: 'Possible anaphylactic reaction',
    severity: 'critical',
    guidance: 'Call 911 immediately. Use EpiPen if available. Lie flat with legs elevated unless breathing is difficult.',
    matchAny: true,
  },
  {
    keywords: ['infant fever', 'baby fever', 'newborn fever'],
    condition: 'High fever in infant',
    severity: 'critical',
    guidance: 'Call your pediatrician or go to the ER immediately. Do not give medication without medical guidance for infants under 3 months.',
  },
  {
    keywords: ['103', 'fever'],
    condition: 'High fever — seek medical attention',
    severity: 'high',
    guidance: 'A fever of 103°F (39.4°C) or higher in adults warrants medical attention. Call your doctor or visit urgent care.',
  },
  {
    keywords: ['104', 'fever'],
    condition: 'Dangerously high fever',
    severity: 'critical',
    guidance: 'Call 911 or go to the ER immediately. Apply cool (not cold) compresses while waiting.',
  },
  {
    keywords: ['suicidal', 'end my life', 'want to die', 'kill myself', 'self harm', 'self-harm'],
    condition: 'Mental health crisis',
    severity: 'critical',
    guidance: 'Please call the 988 Suicide & Crisis Lifeline (call or text 988) or go to your nearest emergency room. You are not alone — help is available 24/7.',
    matchAny: true,
  },
  {
    keywords: ['unconscious', 'not breathing', 'collapsed', 'unresponsive'],
    condition: 'Medical emergency — unresponsive person',
    severity: 'critical',
    guidance: 'Call 911 immediately. Begin CPR if trained. Place in recovery position if breathing but unconscious.',
    matchAny: true,
  },
  {
    keywords: ['severe bleeding', 'won\'t stop bleeding', 'heavy bleeding'],
    condition: 'Severe hemorrhage',
    severity: 'critical',
    guidance: 'Call 911. Apply firm, direct pressure with a clean cloth. Do not remove the cloth if blood soaks through — add more layers.',
    matchAny: true,
  },
  {
    keywords: ['seizure', 'convulsion', 'fitting'],
    condition: 'Seizure activity',
    severity: 'high',
    guidance: 'Call 911 if seizure lasts more than 5 minutes or if this is a first seizure. Clear the area of dangerous objects. Do not put anything in their mouth.',
    matchAny: true,
  },
  {
    keywords: ['overdose', 'too many pills', 'took too much'],
    condition: 'Possible overdose',
    severity: 'critical',
    guidance: 'Call 911 and Poison Control (1-800-222-1222) immediately. Do not induce vomiting unless directed by medical professionals.',
    matchAny: true,
  },
];

// In-memory log of all red-flag events
const redFlagLog = [];

/**
 * Detects red-flag emergency conditions in user input.
 * @param {string} message - The user's message text
 * @returns {{ isRedFlag: boolean, conditions: Array<{ condition: string, severity: string, guidance: string }> }}
 */
export function detectRedFlags(message) {
  if (!message || typeof message !== 'string') {
    return { isRedFlag: false, conditions: [] };
  }

  const lowerMessage = message.toLowerCase();
  const detectedConditions = [];

  for (const pattern of RED_FLAG_PATTERNS) {
    let matched = false;

    if (pattern.matchAny) {
      // Match if ANY keyword is found
      matched = pattern.keywords.some((keyword) =>
        lowerMessage.includes(keyword.toLowerCase())
      );
    } else {
      // Match if ALL keywords are found
      matched = pattern.keywords.every((keyword) =>
        lowerMessage.includes(keyword.toLowerCase())
      );
    }

    if (matched) {
      detectedConditions.push({
        condition: pattern.condition,
        severity: pattern.severity,
        guidance: pattern.guidance,
      });
    }
  }

  const isRedFlag = detectedConditions.length > 0;

  // Log the event with timestamp
  if (isRedFlag) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message: message.substring(0, 200), // Truncate for privacy
      conditions: detectedConditions.map((c) => c.condition),
    };
    redFlagLog.push(logEntry);
    console.warn('[RED FLAG DETECTED]', JSON.stringify(logEntry));
  }

  return { isRedFlag, conditions: detectedConditions };
}

/**
 * Returns the in-memory red-flag event log.
 * @returns {Array}
 */
export function getRedFlagLog() {
  return [...redFlagLog];
}
