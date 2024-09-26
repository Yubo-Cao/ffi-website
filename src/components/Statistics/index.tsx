import SingleStatistics from "@/components/Statistics/SingleStatistics";

export default function Statistics() {
  return (
    <section id="statistics" className="bg-white dark:bg-bg-color-dark py-16 md:py-20 lg:py-28">
      <div className="container grid items-center justify-center gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SingleStatistics value={50} label={"States Reached"} suffix="+" />
        <SingleStatistics value={53} label={"High School Chapters"} />
        <SingleStatistics value={13} label={"National Board Directors"} />
      </div>
    </section>
  );
}
