// ═══════════════════════════════════════════════════════════════
// Biosphere — Ecology & Evolution Assessment Engine
// Ecosystem challenges, evolution scenarios, food web quizzes & XP gamification
// ═══════════════════════════════════════════════════════════════

import { EcosystemChallenge, EcologyQuizQuestion } from "../types";

export class EcologyAssessmentEngine {
  public static getChallenges(): EcosystemChallenge[] {
    return [
      {
        id: "chal_invasive_control",
        title: "Contain the Bio-Invasion",
        subtitle: "Ecosystem Balance Challenge",
        description:
          "An invasive species has entered the forest ecosystem and is outcompeting native browsers. Restore native biodiversity ($H' \\ge 1.0$) within 40 generations.",
        targetBiomeId: "forest",
        initialPopulations: { spec_oak_grass: 180, spec_forest_deer: 25, spec_timber_wolf: 6 },
        initialClimate: { temperature: 20, rainfall: 90 },
        initialDisturbance: "invasive_species",
        goalDescription: "Maintain Shannon Index H' >= 1.0 and Producer count >= 100 for 30 consecutive ticks.",
        winCondition: (eco, metrics) => metrics.shannonIndex >= 1.0 && (eco.populations["spec_oak_grass"]?.count || 0) >= 100,
        xpReward: 350,
        badgeId: "badge_bio_guardian",
      },
      {
        id: "chal_heatwave_survival",
        title: "Survive Extreme Global Heatwave",
        subtitle: "Climate Change Resilience Challenge",
        description:
          "Ambient temperatures rise to 38°C in the Coral Reef ecosystem. Adjust climate parameters and select thermal-tolerant traits to prevent total extinction.",
        targetBiomeId: "reef",
        initialPopulations: { spec_coral_algae: 200, spec_parrotfish: 50, spec_reef_shark: 10 },
        initialClimate: { temperature: 38, rainfall: 40, weather: "heatwave" },
        goalDescription: "Sustain all 3 reef species above minimum viable population (count >= 15) for 50 ticks.",
        winCondition: (eco) =>
          (eco.populations["spec_coral_algae"]?.count || 0) >= 15 &&
          (eco.populations["spec_parrotfish"]?.count || 0) >= 15 &&
          (eco.populations["spec_reef_shark"]?.count || 0) >= 15,
        xpReward: 450,
        badgeId: "badge_climate_master",
      },
      {
        id: "chal_speciation_trigger",
        title: "Drive Speciation in 60 Generations",
        subtitle: "Macroevolution Scenario",
        description:
          "Apply directional environmental pressure to trigger genetic isolation and speciation in your population cladogram.",
        targetBiomeId: "desert",
        initialPopulations: { spec_saguaro_cactus: 150, spec_kangaroo_rat: 40, spec_desert_coyote: 10 },
        initialClimate: { temperature: 34, rainfall: 15 },
        goalDescription: "Achieve at least 1 speciation branch point in the Evolution Cladogram.",
        winCondition: (eco) => eco.generation >= 50 && Object.keys(eco.populations).length > 3,
        xpReward: 500,
        badgeId: "badge_darwinian_architect",
      },
    ];
  }

  public static getQuizzes(): EcologyQuizQuestion[] {
    return [
      {
        id: "q_10_percent_rule",
        question: "According to Lindeman's 10% Rule of ecological efficiency, what happens to the remaining 90% of energy at each trophic level transition?",
        options: [
          "It is stored permanently in soil humus",
          "It is lost as metabolic heat, respiration, and unabsorbed waste",
          "It converts directly into solar UV radiation",
          "It transfers to decomposers without any loss",
        ],
        correctAnswerIndex: 1,
        explanation:
          "Approximately 90% of energy is expended through cellular respiration, locomotion, metabolic heat loss, and indigestible biomass at each step up the food pyramid.",
        concept: "Trophic Energetics",
      },
      {
        id: "q_shannon_index",
        question: "What does a high Shannon Diversity Index (H') indicate about a biological community?",
        options: [
          "The ecosystem is dominated by a single invasive species",
          "Species richness and abundance evenness are both high",
          "The ecosystem has zero primary producers",
          "The carrying capacity has reached negative infinity",
        ],
        correctAnswerIndex: 1,
        explanation:
          "The Shannon Index H' measures both species richness (number of different species) and evenness (how equally individuals are distributed among species).",
        concept: "Biodiversity Quantifications",
      },
      {
        id: "q_keystone_species",
        question: "Why is the Gray Timber Wolf classified as a keystone species in temperate forest ecosystems?",
        options: [
          "It produces 80% of forest oxygen through photosynthesis",
          "It regulates herbivore grazing via top-down control, preventing overgrazing of forest vegetation",
          "It is the only decomposer able to digest lignin",
          "It outcompetes all primary producers for sunlight",
        ],
        correctAnswerIndex: 1,
        explanation:
          "As an apex predator, wolves exercise top-down trophic cascade control, preventing ungulates from overgrazing saplings and maintaining habitat stability for songbirds and beavers.",
        concept: "Keystone Species & Trophic Cascades",
      },
    ];
  }
}
