@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 182 100% 74%;
    --primary-foreground: 182 100% 10%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 210 40% 9.8%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 0 0% 75%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 182 100% 74%;
    --radius: 0.5rem;
    --chart-1: 182 76% 61%;
    --chart-2: 182 58% 39%;
    --chart-3: 182 37% 24%;
    --chart-4: 182 74% 66%;
    --chart-5: 182 87% 67%;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 240 6% 10%;
    --foreground: 0 0% 98%;
    --card: 240 6% 10%;
    --card-foreground: 0 0% 98%;
    --popover: 240 6% 10%;
    --popover-foreground: 0 0% 98%;
    --primary: 182 92% 54%;
    --primary-foreground: 182 100% 10%;
    --secondary: 0 0% 15%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 5% 15%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 240 5% 20%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 4% 20%;
    --input: 240 5% 20%;
    --ring: 182 92% 54%;
    --chart-1: 182 76% 61%;
    --chart-2: 182 58% 39%;
    --chart-3: 182 37% 24%;
    --chart-4: 182 74% 66%;
    --chart-5: 182 87% 67%;
    --sidebar-background: 240 6% 12%;
    --sidebar-foreground: 0 0% 85%;
    --sidebar-primary: 182 100% 74.3%;
    --sidebar-primary-foreground: 182 100% 10%;
    --sidebar-accent: 240 6% 16%;
    --sidebar-accent-foreground: 182 100% 74.3%;
    --sidebar-border: 240 6% 16%;
    --sidebar-ring: 182 100% 74.3%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
