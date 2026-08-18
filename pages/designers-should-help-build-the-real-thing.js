import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import ProfileHomeButton from "../components/ProfileHomeButton";
import ReadNext from "../components/ReadNext";
import ArticleHeader from "../components/ArticleHeader";
import styles from "../writing-article.module.css";

export default function DesignersShouldHelpBuildTheRealThingPage() {
  useEffect(() => {
    document.body.classList.add("loaded");
  }, []);

  return (
    <>
      <Head>
        <title>Designers Should Help Build the Real Thing — Danny Ohana</title>
        <meta
          name="description"
          content="The divide between designers and engineers can shrink when designers help build the final product."
        />
        <link
          rel="canonical"
          href="https://www.dannyohana.com/designers-should-help-build-the-real-thing"
        />
      </Head>

      <main className={styles.page}>
        <header className={styles.siteHeader}>
          <ProfileHomeButton />
        </header>

        <div className={styles.layout}>
          <article className={styles.article}>
            <ArticleHeader
              title="Designers Should Help Build the Real Thing"
              summary="All designers used to be engineers."
            />

            <div className={styles.body}>
              <figure className={styles.articleImage}>
                <Image
                  src="/designers-build-real-thing.png"
                  alt="Jony Ive holding a translucent keyboard prototype in a workshop"
                  width={980}
                  height={546}
                  layout="responsive"
                  priority
                />
              </figure>

              <blockquote className={styles.quote}>
                <p>
                  Before “Design” was as established as it is today, most
                  “design-minded” people were actually just engineers and
                  craftspeople with an aptitude for design.
                </p>
                <p>
                  Excited that it’s now the norm again—designers helping to make
                  the real thing in the final medium. E.g. majority of designers
                  on my team at @NotionHQ now open PRs.
                </p>
                <cite>— Raphael Schaad</cite>
              </blockquote>

              <p>
                This is what I’ve been trying to say, but it feels too
                controversial to bring up in a meeting with other designers at
                work.
              </p>

              <p>James Dyson was a design engineer.</p>

              <p>
                Believe it or not, Jony Ive was a design engineer, too. His team
                frequently experimented with the CNC machines at Apple.
              </p>

              <p>The design handoff process doesn’t work when:</p>

              <ul>
                <li>The designer doesn’t know how to build things.</li>
                <li>
                  The engineers don’t care about—or aren’t good at—the design
                  details.
                </li>
              </ul>

              <p>
                It seems like we’re finally at a point where this wide chasm
                between designers and engineers can begin to shrink again.
              </p>
            </div>
          </article>
        </div>
      </main>

      <ReadNext currentUrl="/designers-should-help-build-the-real-thing" />
    </>
  );
}
