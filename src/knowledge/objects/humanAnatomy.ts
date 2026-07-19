// ═══════════════════════════════════════════════════════════════
// Biosphere — Human Anatomy Knowledge Objects
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";

export const HUMAN_ANATOMY_OBJECTS: KnowledgeObject[] = [
  {
    id: "heart",
    name: "Heart",
    scientificName: "Cor",
    category: "human-anatomy",
    subcategory: "Cardiovascular System",
    icon: "human-body",
    accentColor: "#FF4757",
    description: "The heart is a muscular organ that pumps blood through the circulatory system. It beats approximately 100,000 times per day, delivering oxygenated blood to tissues and returning deoxygenated blood to the lungs.",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    prerequisites: [],
    learningObjectives: [
      { text: "Describe the four chambers of the heart", icon: "human-body" },
      { text: "Trace the path of blood through the heart", icon: "process-simulations" },
      { text: "Explain the cardiac cycle and electrical conduction system", icon: "virtual-lab" },
    ],
    importantTerms: [
      { term: "Atrium", definition: "Upper chambers of the heart that receive blood returning from the body or lungs." },
      { term: "Ventricle", definition: "Lower chambers that pump blood out of the heart to the lungs or body." },
      { term: "Sinoatrial (SA) Node", definition: "The heart's natural pacemaker, initiating the electrical impulse for each heartbeat." },
      { term: "Cardiac Cycle", definition: "One complete sequence of contraction (systole) and relaxation (diastole) of the heart." },
      { term: "Coronary Arteries", definition: "Blood vessels supplying oxygen-rich blood to the heart muscle itself." },
    ],
    summary: "The heart is a four-chambered muscular pump. The right side receives deoxygenated blood and sends it to the lungs; the left side receives oxygenated blood and pumps it to the body. Its rhythmic beating is controlled by the SA node.",
    quickRevision: [
      "Four chambers: right atrium, right ventricle, left atrium, left ventricle.",
      "Right side → pulmonary circulation (lungs). Left side → systemic circulation (body).",
      "SA node = pacemaker. Impulse: SA → AV → Bundle of His → Purkinje fibers.",
      "Cardiac output = heart rate × stroke volume.",
    ],
    interestingFacts: [
      "The heart beats ~100,000 times per day and pumps ~7,500 liters of blood!",
      "The left ventricle has walls 3x thicker than the right — it must pump blood to the entire body.",
      "A blue whale's heart is the size of a small car and beats only 8-10 times per minute.",
    ],
    commonMisconceptions: [
      "Misconception: The heart is on the left side of the chest. Reality: It sits in the center of the chest (mediastinum), slightly tilted left.",
      "Misconception: Deoxygenated blood is blue. Reality: It's dark red; veins appear blue due to light absorption through skin.",
    ],
    scientists: [
      { name: "William Harvey", contribution: "Described the complete circulatory system and heart function", year: "1628" },
      { name: "Christiaan Barnard", contribution: "Performed the first human heart transplant", year: "1967" },
    ],
    timeline: [
      { year: "1628", title: "Circulation Described", description: "William Harvey published 'De Motu Cordis', describing blood circulation." },
      { year: "1967", title: "First Heart Transplant", description: "Christiaan Barnard performed the first human-to-human heart transplant in Cape Town." },
    ],
    images: [],
    infographics: [],
    model3D: { url: "/human-body", accentColor: "#FF4757" },
    simulationUrl: "/process-simulations",
    askAiPrompt: "Explain the anatomy and physiology of the human heart, including chambers, valves, the cardiac cycle, and the electrical conduction system.",
    parentTopicId: undefined,
    childTopicIds: [],
    relatedTopicIds: ["mitochondria"],
    prerequisiteIds: [],
    nextTopicIds: [],
    relatedDiseaseIds: [],
    relatedSpeciesIds: [],
    relatedOrganIds: [],
    relatedCellIds: [],
    relatedSimulationIds: [],
    relatedResearchIds: [],
    clinicalImportance: "Coronary artery disease, heart failure, arrhythmias, and valvular diseases are leading causes of death worldwide. Understanding cardiac anatomy is essential for ECG interpretation, cardiac surgery, and interventional cardiology.",
    realWorldApplications: [
      "Electrocardiography (ECG) records the heart's electrical activity for diagnosis.",
      "Artificial pacemakers replace the SA node when it malfunctions.",
      "Heart-lung machines allow surgeons to operate on a stopped heart.",
    ],
    quiz: {
      id: "heart-quiz",
      title: "Heart Anatomy Quiz",
      questions: [
        { text: "Which chamber pumps blood to the lungs?", options: ["Left Atrium", "Right Ventricle", "Left Ventricle", "Right Atrium"], answerIndex: 1, explanation: "The right ventricle pumps deoxygenated blood through the pulmonary artery to the lungs." },
        { text: "What is the heart's natural pacemaker?", options: ["AV Node", "SA Node", "Bundle of His", "Purkinje Fibers"], answerIndex: 1, explanation: "The sinoatrial (SA) node generates the electrical impulse that initiates each heartbeat." },
        { text: "What did William Harvey describe in 1628?", options: ["Heart transplantation", "Blood circulation", "The stethoscope", "Cardiac surgery"], answerIndex: 1, explanation: "Harvey described the complete circulatory system in 'De Motu Cordis'." },
      ],
    },
    flashcards: [
      { id: "heart-fc-1", front: "How many chambers does the human heart have?", back: "Four: right atrium, right ventricle, left atrium, left ventricle.", category: "Anatomy" },
      { id: "heart-fc-2", front: "What is the SA node?", back: "The sinoatrial node is the heart's natural pacemaker, located in the right atrium. It initiates the electrical impulse for each heartbeat.", category: "Physiology" },
      { id: "heart-fc-3", front: "What is cardiac output?", back: "The volume of blood pumped by the heart per minute. Cardiac Output = Heart Rate × Stroke Volume.", category: "Physiology" },
    ],
    revisionNotes: {
      importantPoints: [
        "Four chambers: 2 atria (receive) + 2 ventricles (pump).",
        "Right side = pulmonary circuit; Left side = systemic circuit.",
        "SA node → AV node → Bundle of His → Purkinje fibers.",
        "Left ventricle has the thickest walls.",
      ],
      keyTerms: [
        { term: "Systole", definition: "Contraction phase of the cardiac cycle." },
        { term: "Diastole", definition: "Relaxation phase of the cardiac cycle." },
        { term: "SA Node", definition: "The heart's pacemaker in the right atrium." },
      ],
      summary: "The heart is a four-chambered muscular pump that drives the circulatory system. The SA node acts as the pacemaker, and the cardiac cycle alternates between systole (contraction) and diastole (relaxation).",
    },
    xpPoints: 200,
    achievementBadge: { id: "cardiac-scholar", title: "Cardiac Scholar", description: "Mastered heart anatomy and physiology", icon: "human-body", xpReward: 200 },
    verification: { status: "published", version: "1.0.0" },
    references: ["Gray's Anatomy, 42nd ed.", "Guyton and Hall Textbook of Medical Physiology"],
    furtherReading: ["Braunwald's Heart Disease (textbook)"],
    existingRoute: "/human-body",
  },
];
