import Foundation

private struct ToneSovereignWebCatalog: Encodable {
    let schemaVersion: Int
    let doors: [GoldenAgeDoor]
    let capacities: [GoldenAgeCapacity]
    let practiceFamilies: [GoldenAgePracticeFamily]
    let fields: [GoldenAgeField]
    let laws: [ConsciousParticipationLaw]
    let lawTeachings: [String: GoldenAgeLawTeaching]
    let principles: [GoldenAgePrinciple]
    let principleTeachings: [String: GoldenAgePrincipleTeaching]
    let practiceEngines: [GoldenAgePracticeEngineDefinition]
    let ruleCommitments: [GoldenAgeRuleCommitmentDefinition]
    let weeklyReviewPrompts: [GoldenAgeWeeklyReviewPrompt]
    let libraryEntries: [GoldenAgeLibraryEntry]
    let sovereignActs: [SovereignAct]
}

@main
private enum ExportToneSovereignCatalog {
    static func main() throws {
        let lawTeachings = Dictionary(uniqueKeysWithValues: GoldenAgeCatalog.laws.compactMap { law in
            GoldenAgeExpandedTeachingCatalog.law(law.id).map { (law.id.rawValue, $0) }
        })
        let principleTeachings = Dictionary(uniqueKeysWithValues: GoldenAgeCatalog.principles.compactMap { principle in
            GoldenAgeExpandedTeachingCatalog.principle(principle.id).map { (principle.id.rawValue, $0) }
        })
        let payload = ToneSovereignWebCatalog(
            schemaVersion: 1,
            doors: GoldenAgeCatalog.doors,
            capacities: GoldenAgeCatalog.capacities,
            practiceFamilies: GoldenAgeCatalog.practiceFamilies,
            fields: GoldenAgeCatalog.fields,
            laws: GoldenAgeCatalog.laws,
            lawTeachings: lawTeachings,
            principles: GoldenAgeCatalog.principles,
            principleTeachings: principleTeachings,
            practiceEngines: GoldenAgeCatalog.practiceEngines,
            ruleCommitments: GoldenAgeCatalog.ruleCommitments,
            weeklyReviewPrompts: GoldenAgeCatalog.weeklyReviewPrompts,
            libraryEntries: GoldenAgeCatalog.libraryEntries,
            sovereignActs: SovereignActCatalog.acts
        )
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys, .withoutEscapingSlashes]
        FileHandle.standardOutput.write(try encoder.encode(payload))
    }
}
