import { ThemeSwitch } from "@/components/theme-switch";

const HeaderMenu = () => {
  return (
    <div className="ml-auto flex items-center gap-2">
      <ThemeSwitch />
    </div>
  );
};

export default HeaderMenu;
