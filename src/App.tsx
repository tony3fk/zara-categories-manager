import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CategoryProvider } from "@/context/CategoryContext";
import CategoryEditor from "@/components/CategoryEditor/CategoryEditor";

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <CategoryProvider>
        <CategoryEditor />
      </CategoryProvider>
    </DndProvider>
  );
};

export default App;
