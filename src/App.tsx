import ProjectCardGrid from "./components/productControl/listingProduct";
import LogoutButton from "./pages/logout";

function App() {
  return (
    <>
      <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-4 mb-4">
        <h1 className="text-lg text-white font-semibold">Admin Management</h1>
        <div>
          <LogoutButton />
        </div>
      </nav>
      <ProjectCardGrid />
    </>
  );
}

export default App;
