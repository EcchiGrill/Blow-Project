import { NavItemProps } from "@/types";
import { NavLink } from "react-router-dom";

function NavItem({ Icon, label, to, onClick, state }: NavItemProps) {
  return (
    <NavLink
      className={({ isActive }: { isActive: boolean }): string => {
        const cn =
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-secondary hover:text-primary";
        return isActive
          ? "bg-secondary text-primary " + cn
          : "text-secondary " + cn;
      }}
      to={to}
      state={state}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}

export default NavItem;
