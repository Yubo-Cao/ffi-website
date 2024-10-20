import Link from "next/link";

export function SocialLinks() {
  return (
    <div className="flex items-center">
      <Link
        href="mailto:futfinanceinc@gmail.com"
        aria-label="social-link"
        target="_blank"
        rel="noopener noreferrer"
        className="dark:text-body-color-dark mr-6 text-body-color duration-300 hover:text-primary dark:hover:text-primary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
          <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
        </svg>
      </Link>
      <Link
        href="https://www.instagram.com/futurefinanceinc/"
        aria-label="social-link"
        target="_blank"
        rel="noopener noreferrer"
        className="dark:text-body-color-dark text-body-color duration-300 hover:text-primary dark:hover:text-primary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="bc4044d7-f71f-475b-94f1-a5fb87068130"
          data-name="Layer 1"
          viewBox="0 0 14.3782 13.8471"
          className="size-5"
          fill="currentColor"
        >
          <path d="M7.19,4.4315A2.5416,2.5416,0,0,0,4.6016,6.924,2.5416,2.5416,0,0,0,7.19,9.4164,2.5417,2.5417,0,0,0,9.7778,6.924,2.5417,2.5417,0,0,0,7.19,4.4315Z" />
          <path d="M11.1965,0H3.1818A3.1819,3.1819,0,0,0,0,3.1818v7.4835a3.1818,3.1818,0,0,0,3.1818,3.1818h8.0147a3.1817,3.1817,0,0,0,3.1817-3.1818V3.1818A3.1818,3.1818,0,0,0,11.1965,0ZM7.1915,10.5247a3.6713,3.6713,0,0,1-3.7384-3.6,3.6713,3.6713,0,0,1,3.7384-3.6,3.6713,3.6713,0,0,1,3.7384,3.6A3.6713,3.6713,0,0,1,7.1915,10.5247Zm4.1673-6.6466a.9883.9883,0,0,1-1.0063-.9693,1.0072,1.0072,0,0,1,2.0129,0A.9885.9885,0,0,1,11.3588,3.8781Z" />
        </svg>
      </Link>
    </div>
  );
}
