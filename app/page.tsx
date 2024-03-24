import Image from "next/image";
import styles from "./page.module.css";
import Visualizer from "@/components/visualizer/Visualizer";

export default function Home() {
  return (
    <main className={styles.main}>
      <Visualizer />
    </main>
  );
}
