export type SubjectCategory = "math" | "la" | "science" | "other";

/**
 * Classifies a topic into a subject category based on its name and slug.
 */
export function getSubjectCategory(topicName: string, topicSlug: string): SubjectCategory {
  const text = `${topicName} ${topicSlug}`.toLowerCase();

  // Math topics -> Blue
  if (
    text.includes("math") ||
    text.includes("algebra") ||
    text.includes("geometry") ||
    text.includes("calculus") ||
    text.includes("trigonometry") ||
    text.includes("arithmetic") ||
    text.includes("statistic") ||
    text.includes("probability") ||
    text.includes("fraction") ||
    text.includes("equation") ||
    text.includes("number")
  ) {
    return "math";
  }

  // Science topics -> Red
  if (
    text.includes("science") ||
    text.includes("bio") ||
    text.includes("cell") ||
    text.includes("tissue") ||
    text.includes("chem") ||
    text.includes("physics") ||
    text.includes("astro") ||
    text.includes("genetics") ||
    text.includes("anatomy") ||
    text.includes("organ")
  ) {
    return "science";
  }

  // Language Arts (LA) -> Yellow (same as Other)
  if (
    text.includes("la") ||
    text.includes("language") ||
    text.includes("reading") ||
    text.includes("writing") ||
    text.includes("english") ||
    text.includes("grammar") ||
    text.includes("literature") ||
    text.includes("vocab") ||
    text.includes("spelling") ||
    text.includes("essay")
  ) {
    return "la";
  }

  // Other topics -> Yellow
  return "other";
}

/**
 * Returns color styles and classes according to the user's rules:
 * - Math: Blue cards
 * - Science: Red cards
 * - LA: Yellow cards
 * - Other: Yellow cards
 * - Fully Mastered: Green cards
 */
export function getSubjectCardStyle(category: SubjectCategory, isFullyMastered = false) {
  if (isFullyMastered) {
    return {
      category,
      color: "#10B981", // Emerald Green
      cardClass: "bg-emerald-500/15 border-2 border-emerald-500 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-400 dark:text-emerald-100 shadow-md shadow-emerald-500/10",
      headerHoverClass: "hover:bg-emerald-500/20 dark:hover:bg-emerald-900/30",
      badgeClass: "bg-emerald-500 text-white font-bold",
      subtopicText: "text-emerald-900 dark:text-emerald-100",
      iconBg: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    };
  }

  switch (category) {
    case "math":
      return {
        category,
        color: "#3B82F6", // Blue
        cardClass: "bg-blue-500/10 border border-blue-500/30 text-foreground dark:bg-blue-950/20 dark:border-blue-500/40",
        headerHoverClass: "hover:bg-blue-500/15 dark:hover:bg-blue-900/30",
        badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        subtopicText: "text-foreground",
        iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
      };
    case "science":
      return {
        category,
        color: "#EF4444", // Red
        cardClass: "bg-red-500/10 border border-red-500/30 text-foreground dark:bg-red-950/20 dark:border-red-500/40",
        headerHoverClass: "hover:bg-red-500/15 dark:hover:bg-red-900/30",
        badgeClass: "bg-red-500/10 text-red-600 dark:text-red-400",
        subtopicText: "text-foreground",
        iconBg: "bg-red-500/15 text-red-600 dark:text-red-400",
      };
    case "la":
    case "other":
    default:
      return {
        category,
        color: "#F59E0B", // Yellow / Amber
        cardClass: "bg-amber-500/10 border border-amber-500/30 text-foreground dark:bg-amber-950/20 dark:border-amber-500/40",
        headerHoverClass: "hover:bg-amber-500/15 dark:hover:bg-amber-900/30",
        badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        subtopicText: "text-foreground",
        iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      };
  }
}
