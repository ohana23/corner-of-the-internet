import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import ProfileHomeButton from "../components/ProfileHomeButton";
import ReadNext from "../components/ReadNext";
import ArticleHeader from "../components/ArticleHeader";
import styles from "../writing-article.module.css";

export default function ReadingMobyDickBecauseWhyNotPage() {
  useEffect(() => {
    document.body.classList.add("loaded");
  }, []);

  return (
    <>
      <Head>
        <title>Reading Moby-Dick Because Why Not — Danny Ohana</title>
        <meta
          name="description"
          content="A few observations from reading Herman Melville’s Moby-Dick."
        />
        <link
          rel="canonical"
          href="https://www.dannyohana.com/reading-moby-dick-because-why-not"
        />
      </Head>

      <main className={styles.page}>
        <header className={styles.siteHeader}>
          <ProfileHomeButton />
        </header>

        <div className={styles.layout}>
          <article className={styles.article}>
            <ArticleHeader
              title="Reading Moby-Dick Because Why Not"
              summary="Random thoughts on the classic"
            />

            <div className={styles.body}>
              <figure className={`${styles.articleImage} ${styles.bookCover}`}>
                <Image
                  src="/moby-dick-cover.png"
                  alt="Penguin Classics cover of Moby-Dick by Herman Melville"
                  width={654}
                  height={1000}
                  layout="responsive"
                  priority
                />
              </figure>

              <p>Every chapter has at least 12 words I’ve never seen before.</p>

              <p>
                Some chapters are harder than others. Sometimes I realize I’ve
                been reading with my brain completely switched off. But I’m
                pushing through, trying to focus on the surface-level meaning of
                the words and working harder to follow the threads of symbolism.
              </p>

              <p>
                When things are clicking and Melville makes sense to me, it’s a
                very enjoyable read.
              </p>

              <p>
                The sentences are Shakespearean—in other words, dramatic and
                action-packed.
              </p>

              <p>Humor is sprinkled throughout.</p>

              <p>
                It’s abundant with references, most of which require a guide to
                understand.
              </p>

              <p>
                Whenever you start believing the narrative is taking itself too
                seriously, Melville reminds you how absurd the characters are.
              </p>

              <p>Then you’re like, “No, wait—this is fun.”</p>
            </div>
          </article>
        </div>
      </main>

      <ReadNext currentUrl="/reading-moby-dick-because-why-not" />
    </>
  );
}
