import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import ProfileHomeButton from "../components/ProfileHomeButton";
import SiteFooter from "../components/SiteFooter";
import ArticleHeader from "../components/ArticleHeader";
import styles from "../writing-article.module.css";

export default function ReviewOfSevenevesPage() {
  useEffect(() => {
    document.body.classList.add("loaded");
  }, []);

  return (
    <>
      <Head>
        <title>Review of Seveneves by Neal Stephenson — Danny Ohana</title>
        <meta
          name="description"
          content="A review of Seveneves by Neal Stephenson—a new favorite."
        />
        <link
          rel="canonical"
          href="https://www.dannyohana.com/review-of-seveneves-by-neal-stephenson"
        />
      </Head>

      <main className={styles.page}>
        <header className={styles.siteHeader}>
          <ProfileHomeButton />
        </header>

        <div className={styles.layout}>
          <article className={styles.article}>
            <ArticleHeader
              title="Review of Seveneves by Neal Stephenson"
              summary="A new favorite."
            />

            <div className={styles.body}>
              <figure className={`${styles.articleImage} ${styles.bookCover}`}>
                <Image
                  src="/seveneves-cover.png"
                  alt="Book cover of Seveneves by Neal Stephenson"
                  width={665}
                  height={1000}
                  layout="responsive"
                  priority
                />
              </figure>

              <p>
                <em>Seveneves</em> was better than I thought it would be.
              </p>

              <p>
                I loved the technical explanations of orbital mechanics and life
                on a futuristic ISS.
              </p>

              <p>
                Then a certain “villain” was introduced, and she was so deceptive
                and conniving that I hated her in the best way possible.
              </p>

              <p>
                I haven’t gritted my teeth at a villain that hard since Professor
                Umbridge.
              </p>

              <p>The rest of the cast was good, too.</p>

              <p>
                So far, it’s the longest book I’ve read by word count, and I’m
                actually happy it’s as long as it is.
              </p>

              <p>
                It’s packed with amazing hard science-fiction ideas, and I can’t
                wait to jump back into it in a few years with a fresh perspective.
              </p>

              <p>
                Some of the technology was hard to visualize on this read-through.
              </p>

              <p>
                There’s nice banter between Dinah and Ivy, along with some great,
                Sorkin-esque, high-IQ—but realistic—dialogue.
              </p>

              <p>
                Oh, and while I understand why people hate the last third of the
                book, I liked it.
              </p>

              <p>
                No, I didn’t understand the importance of Kath Two and her
                epigenetic shift at the end. It seemed like an idea for its own
                sake, unless I missed something.
              </p>

              <p>Yeah, the Pingers were a little far-out.</p>

              <p>
                But I gave Stephenson the benefit of the doubt and just let myself
                enjoy it.
              </p>

              <p>
                Overall, I’d read it again and recommend it to anyone looking for
                a kick-ass piece of science fiction.
              </p>

              <figure className={`${styles.articleImage} ${styles.bottomArtwork}`}>
                <Image
                  src="/seveneves-christian-pearce.png"
                  alt="Concept art of a futuristic orbital habitat above Earth"
                  width={1134}
                  height={1666}
                  layout="responsive"
                />
                <figcaption>by Christian Pearce on Artstation</figcaption>
              </figure>
            </div>
          </article>
        </div>
      </main>

      <div className={styles.footerWrap}>
        <SiteFooter />
      </div>
    </>
  );
}
