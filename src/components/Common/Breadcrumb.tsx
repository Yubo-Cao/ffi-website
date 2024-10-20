import Link from "next/link";

const Breadcrumb = ({
  pageName,
  parentPageName = "Home",
  parentPageLink = "/",
  description,
  onSubmit,
  isEditing = false,
  className = "",
}: {
  pageName: string;
  parentPageName?: string;
  parentPageLink?: string;
  description: string;
  onSubmit?: (arg: { name: string; description: string }) => void;
  isEditing?: boolean;
  className?: string;
}) => {
  return (
    <>
      <section
        className={`relative z-10 pt-[120px] sm:pt-[180px] lg:pt-[206px] ${className}`}
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 md:w-8/12 lg:w-7/12">
              <div
                className={`max-w-[570px] ${description && "mb-8 md:mb-0 lg:mb-12"}`}
              >
                {pageName !== "<LOADING>" ? (
                  <h1
                    className={`${description && "mb-5"} text-2xl font-bold text-black dark:text-white sm:text-3xl`}
                  >
                    {pageName}
                  </h1>
                ) : (
                  <h1 className="mb-5 h-8 w-1/2 animate-pulse rounded-sm bg-gray-200 dark:bg-gray-800"></h1>
                )}
                {description !== "<LOADING>" ? (
                  isEditing ? (
                    <textarea
                      defaultValue={description}
                      onBlur={(e) =>
                        onSubmit({
                          name: pageName,
                          description: e.target.value,
                        })
                      }
                      className={`w-full h-24 p-4 text-base font-medium leading-relaxed text-body-color rounded-md`}
                    />
                  ) : (
                    description && (
                      <p className="text-base font-medium leading-relaxed text-body-color">
                        {description}
                      </p>
                    )
                  )
                ) : (
                  <div className="h-4 w-full animate-pulse rounded-sm bg-gray-200 dark:bg-gray-800"></div>
                )}
              </div>
            </div>
            <div className="w-full px-4 md:w-4/12 lg:w-5/12">
              <div className="text-end">
                <ul className="flex items-center md:justify-end">
                  <li className="flex items-center">
                    <Link
                      href={parentPageLink}
                      className="pr-1 text-base font-medium text-body-color hover:text-primary"
                    >
                      {parentPageName !== "<LOADING>" ? (
                        parentPageName
                      ) : (
                        <div className="h-6 w-20 animate-pulse rounded-sm bg-gray-200 dark:bg-gray-800"></div>
                      )}
                    </Link>
                    <span className="mr-3 block h-2 w-2 rotate-45 border-r-2 border-t-2 border-body-color"></span>
                  </li>
                  {pageName !== "<LOADING>" ? (
                    isEditing ? (
                      <input
                        type="text"
                        defaultValue={pageName}
                        onBlur={(e) =>
                          onSubmit({ name: e.target.value, description })
                        }
                      />
                    ) : (
                      <li className="text-base font-medium text-primary">
                        {pageName}
                      </li>
                    )
                  ) : (
                    <li className="ml-3 h-6 w-20 animate-pulse rounded-sm bg-gray-200 dark:bg-gray-800"></li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <span className="absolute left-0 top-0 z-[-1]">
            <svg
              width="287"
              height="254"
              viewBox="0 0 287 254"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.1"
                d="M286.5 0.5L-14.5 254.5V69.5L286.5 0.5Z"
                fill="url(#paint0_linear_111:578)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_111:578"
                  x1="-40.5"
                  y1="117"
                  x2="301.926"
                  y2="-97.1485"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="absolute right-0 top-0 z-[-1]">
            <svg
              width="628"
              height="258"
              viewBox="0 0 628 258"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.1"
                d="M669.125 257.002L345.875 31.9983L524.571 -15.8832L669.125 257.002Z"
                fill="url(#paint0_linear_0:1)"
              />
              <path
                opacity="0.1"
                d="M0.0716344 182.78L101.988 -15.0769L142.154 81.4093L0.0716344 182.78Z"
                fill="url(#paint1_linear_0:1)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_0:1"
                  x1="644"
                  y1="221"
                  x2="429.946"
                  y2="37.0429"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_0:1"
                  x1="18.3648"
                  y1="166.016"
                  x2="105.377"
                  y2="32.3398"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </div>
      </section>
    </>
  );
};

export default Breadcrumb;
