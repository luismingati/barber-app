"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Search: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
     <Input placeholder="Busque por uma barbearia..." />
     <Button variant="default" size="icon">
        <SearchIcon size={20} />
     </Button>
    </div>
  );
};

export default Search;
