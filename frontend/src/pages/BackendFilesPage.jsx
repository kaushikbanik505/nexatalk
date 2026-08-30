import CodeFileExplorer from "../components/CodeFileExplorer";
import {
  BACKEND_FILES,
  BACKEND_FOLDER_COLORS,
  BACKEND_FOLDER_LABELS,
  BACKEND_FOLDER_ORDER,
} from "../data/backendFilesMeta";

const BackendFilesPage = () => (
  <CodeFileExplorer
    eyebrow="BACKEND"
    eyebrowColorClass="text-success"
    headerColor="success"
    title="Every backend file, in full"
    rootLabel="backend/src"
    files={BACKEND_FILES}
    folderOrder={BACKEND_FOLDER_ORDER}
    folderLabels={BACKEND_FOLDER_LABELS}
    folderColors={BACKEND_FOLDER_COLORS}
  />
);

export default BackendFilesPage;
