import { lazy, Suspense, useEffect, useState } from "react";
import {
  AdventureHooks,
  Appearance,
  GeneralInformation,
  GeneratorControls,
  Goal,
  NPCEditor,
  Occupation,
  Personality,
  PreviewPanel,
  Relationships,
  SavedNPCPanel,
  Secrets,
} from "./components";
import { useNPCGenerator } from "./hooks/useNPCGenerator";
import type { SectionKey } from "./ui/types";
import type { WorkspaceNPC } from "./workspace";
import {
  loadCampaignWorld,
  saveCampaignWorld,
} from "./features/world/services";
import type { Campaign, World } from "./features/world/types";
import type { WorkspaceCampaign } from "./workspace";

const Backstory = lazy(() =>
  import("./components/Backstory").then((module) => ({
    default: module.Backstory,
  })),
);
const DialoguePanel = lazy(() =>
  import("./features/aiDialogue/components/DialoguePanel").then((module) => ({
    default: module.DialoguePanel,
  })),
);
const PortraitPanel = lazy(() =>
  import("./features/visualIdentity/components/PortraitPanel").then(
    (module) => ({ default: module.PortraitPanel }),
  ),
);
const CampaignDashboard = lazy(() =>
  import("./features/world/components/CampaignDashboard").then((module) => ({
    default: module.CampaignDashboard,
  })),
);
type Theme = "light" | "dark";
export function SmartNPCGenerator() {
  const [theme, setTheme] = useState<Theme>(() =>
      window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark",
    ),
    [editorRecord, setEditorRecord] = useState<WorkspaceNPC | null>(null),
    [dialogueRecord, setDialogueRecord] = useState<WorkspaceNPC | null>(null),
    [visualRecord, setVisualRecord] = useState<WorkspaceNPC | null>(null),
    [worldCampaign, setWorldCampaign] = useState<WorkspaceCampaign | null>(
      null,
    ),
    app = useNPCGenerator();
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const props = (section: SectionKey) => ({
    npc: app.npc,
    section,
    locked: app.locks[section],
    onLock: () => app.toggleLock(section),
    onRegenerate: (field?: string, index?: number) =>
      app.reroll(section, field, index),
  });
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Dungeon Tools home">
          <span className="brand__mark">
            <span>D20</span>
          </span>
          <span className="brand__name">Dungeon Tools</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#generator" className="nav-active">
            Generators
          </a>
          <a href="#saved">NPC Workspace</a>
        </nav>
        <button
          className="theme-toggle"
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </header>
      <main id="top">
        <div className="hero">
          <p className="eyebrow">Character workshop</p>
          <h1>Smart NPC Generator</h1>
          <p>
            Build coherent, campaign-ready characters whose history, motives,
            and relationships belong together.
          </p>
        </div>
        <GeneratorControls
          filters={app.filters}
          onFilters={app.setFilters}
          advanced={app.advanced}
          onAdvanced={app.setAdvanced}
          loading={app.loading}
          progress={app.progress}
          error={app.error}
          onGenerate={app.generate}
          onClear={app.clear}
        />
        <div className="workspace" id="generator">
          <div className="form-column">
            <GeneralInformation {...props("general")} />
            {app.advanced && <Appearance {...props("appearance")} />}
            <Personality {...props("personality")} />
            <Occupation {...props("occupation")} />
            <Suspense fallback={<SectionSkeleton />}>
              <Backstory {...props("backstory")} />
            </Suspense>
            <Goal {...props("goal")} />
            {app.advanced && <Relationships {...props("relationships")} />}{" "}
            {app.advanced && <Secrets {...props("secret")} />}
            <AdventureHooks {...props("hooks")} />
          </div>
          <div className="preview-column">
            <PreviewPanel
              npc={app.npc}
              loading={app.loading}
              onSave={app.save}
            />
          </div>
        </div>
        <div id="saved">
          <SavedNPCPanel
            workspace={app.workspace}
            onLoad={app.setNpc}
            onEdit={setEditorRecord}
            onDialogue={setDialogueRecord}
            onVisual={setVisualRecord}
            onWorld={setWorldCampaign}
          />
        </div>
      </main>
      {editorRecord && (
        <NPCEditor
          key={editorRecord.id}
          record={editorRecord}
          user={editorRecord.metadata.author}
          onClose={() => setEditorRecord(null)}
          onSave={async (draft, history, autosave) => {
            const update = {
              npc: draft.npc,
              flavor: draft.flavor,
              changeHistory: history,
              reason: autosave
                ? "NPC editor auto save"
                : "NPC editor manual save",
            };
            app.setNpc(draft.npc);
            if (autosave) {
              app.workspace.scheduleAutosave(editorRecord.id, update);
              return;
            }
            const saved = await app.workspace.updateMetadata(
              editorRecord.id,
              update,
            );
            if (saved) setEditorRecord(saved);
          }}
        />
      )}
      {dialogueRecord && (
        <DialoguePanel
          key={dialogueRecord.id}
          record={dialogueRecord}
          onClose={() => setDialogueRecord(null)}
        />
      )}{" "}
      {visualRecord && (
        <PortraitPanel
          key={visualRecord.id}
          record={visualRecord}
          onClose={() => setVisualRecord(null)}
        />
      )}{" "}
      {worldCampaign && (
        <WorldWorkspace
          campaign={worldCampaign}
          npcs={(app.workspace.snapshot?.npcs ?? [])
            .filter((record) =>
              record.metadata.campaignIds.includes(worldCampaign.id),
            )
            .map((record) => record.npc)}
          onClose={() => setWorldCampaign(null)}
        />
      )}
      <footer>
        <span>Smart NPC Generator</span>
        <span>Built for storytellers and game masters.</span>
      </footer>
    </div>
  );
}
function SectionSkeleton() {
  return (
    <div
      className="section-card section-skeleton"
      aria-label="Loading backstory editor"
    >
      <div className="skeleton" />
      <div className="skeleton tall" />
    </div>
  );
}
function WorldWorkspace({
  campaign: native,
  npcs,
  onClose,
}: {
  readonly campaign: WorkspaceCampaign;
  readonly npcs: readonly WorkspaceNPC["npc"][];
  readonly onClose: () => void;
}) {
  const stored = loadCampaignWorld(native.id),
    now = new Date().toISOString(),
    campaign: Campaign = stored?.campaign ?? {
      id: native.id,
      name: native.name,
      description: "",
      setting: "",
      createdAt: native.createdAt,
      updatedAt: native.modifiedAt,
      status: "planning",
      tags: [],
      npcIds: npcs.map((n) => n.id),
      cityIds: [],
      factionIds: [],
      timeline: [],
      notes: "",
    },
    world: World = stored?.world ?? {
      id: crypto.randomUUID(),
      name: native.name,
      description: "Campaign world details have not been defined yet.",
      era: "",
      theme: "",
      regions: [],
      cities: [],
      kingdoms: [],
      factions: [],
      guilds: [],
      religions: [],
      history: [],
      relationships: [],
      familyLinks: [],
      routes: [],
    };
  return (
    <CampaignDashboard
      initialWorld={world}
      campaign={{ ...campaign, npcIds: npcs.map((n) => n.id), updatedAt: now }}
      npcs={npcs}
      onClose={onClose}
      onWorldChange={(next) =>
        saveCampaignWorld({
          campaign: {
            ...campaign,
            npcIds: npcs.map((n) => n.id),
            updatedAt: new Date().toISOString(),
          },
          world: next,
        })
      }
    />
  );
}
