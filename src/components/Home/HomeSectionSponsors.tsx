import SectionTitle from "@/components/Common/SectionTitle";
import { NAME } from "@/lib/constants";
import Brands from "@/components/Brands";

export const HomeSectionSponsors = () => {
  return (
    <section id="sponsors" className="pb-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title={"Sponsors"}
          paragraph={`Thank you to our sponsors for supporting ${NAME}`}
          mb="1rem"
          center
        />
        <Brands />
      </div>
    </section>
  );
};
export default HomeSectionSponsors;
