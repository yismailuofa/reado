import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";

export default function CreateButton() {
  return (
    <Button variant="surface" style={{ cursor: "pointer" }}>
      Create Link
      <PlusIcon />
    </Button>
  );
}
