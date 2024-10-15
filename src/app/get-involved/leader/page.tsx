import Breadcrumb from "@/components/Common/Breadcrumb";
import { NAME } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import { MdChevronRight } from "react-icons/md";

export const metadata: Metadata = {
  title: `Become a Leader | ${NAME}`,
  description: `Apply to be a leader at ${NAME}`,
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Apply to be a Leader"
        description={`Apply to be a leader at ${NAME}`}
      />
      <div className="container py-16 md:pb-20 lg:pb-28">
        <article className="prose lg:prose-lg dark:prose-invert">
          <p>
            We are excited to present a variety of leadership positions
            available at Future Finance Inc. (FFI). These roles offer a chance
            to develop valuable skills, build networks, and contribute to an
            organization focused on promoting financial literacy. Below are the
            available committees and their responsibilities. We are constantly
            accepting leadership requests.
          </p>
          <Link
            className="font-semi-bold mt-2 inline-block border border-primary px-5 py-3 text-lg text-primary"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdzrPyUH1UluxqbdIdr52gWoUzMmL0hVysMzwXGdjVbzd5JcA/viewform"
          >
            Apply to become a leader
            <MdChevronRight className="ml-2 inline-block" />
          </Link>
          <h2 id="executive-board-on-site---nj">
            Executive Board (On-Site—NJ)
          </h2>
          <ul>
            <li>
              <p>
                <strong>Content Creation Team</strong>:
              </p>
              <ul>
                <li>Instagram: Post once daily.</li>
                <li>
                  TikTok: Create two posts daily; ensure two posts per week
                  feature a face.
                </li>
              </ul>
            </li>
            <li>
              <p>
                <strong>Competition Team</strong>:{" "}
              </p>
              <ul>
                <li>
                  Plan and organize an annual competition event for all
                  branches.
                </li>
                <li>
                  Raise funds for the competition and work on marketing efforts.
                </li>
                <li>Host smaller, local events for the NJ branch.</li>
              </ul>
            </li>
          </ul>
          <h2 id="regional-committee-virtual">Regional Committee (Virtual)</h2>
          <ul>
            <li>
              <p>
                <strong>Regional Director</strong>
              </p>
              <ul>
                <li>
                  Recruit personal connections to join FFI or establish new
                  branches.
                </li>
                <li>
                  Earn volunteer hours based on successful recruitment efforts.
                </li>
              </ul>
            </li>
          </ul>
          <h2 id="state-team-virtual">State Team (Virtual)</h2>
          <ul>
            <li>
              <p>
                <strong>State President</strong>:{" "}
              </p>
              <ul>
                <li>
                  Oversee the state operations and ensure smooth collaboration
                  with the national team.
                </li>
                <li>
                  Keep the executive team informed about state-level operations.
                </li>
                <li>
                  Ensure financial growth and organize local events as needed.
                </li>
              </ul>
            </li>
            <li>
              <p>
                <strong>State Fundraising Chair</strong>:{" "}
              </p>
              <ul>
                <li>
                  Ensure consistent financial growth and responsible management
                  of funds.
                </li>
                <li>
                  Partner with local businesses to raise funds for events and
                  competitions.
                </li>
              </ul>
            </li>
            <li>
              <p>
                <strong>State Communications Chair</strong>:{" "}
              </p>
              <ul>
                <li>
                  Pitch FFI ideas to potential members across the state and
                  manage outreach through LinkedIn.
                </li>
              </ul>
            </li>
          </ul>
        </article>
      </div>
    </>
  );
};

export default AboutPage;
