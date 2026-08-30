import CodeFileExplorer from "../components/CodeFileExplorer";
import {
  FRONTEND_FILES,
  FRONTEND_FOLDER_COLORS,
  FRONTEND_FOLDER_LABELS,
  FRONTEND_FOLDER_ORDER,
} from "../data/frontendFilesMeta";

const FrontendFilesPage = () => (
  <CodeFileExplorer
    eyebrow="FRONTEND"
    eyebrowColorClass="text-info"
    headerColor="info"
    title="Every frontend file, in full"
    rootLabel="frontend/src"
    files={FRONTEND_FILES}
    folderOrder={FRONTEND_FOLDER_ORDER}
    folderLabels={FRONTEND_FOLDER_LABELS}
    folderColors={FRONTEND_FOLDER_COLORS}
  />
);

export default FrontendFilesPage;
