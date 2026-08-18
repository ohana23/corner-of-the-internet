import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import ProfileHomeButton from "../components/ProfileHomeButton";
import ReadNext from "../components/ReadNext";
import ArticleHeader from "../components/ArticleHeader";
import styles from "../writing-article.module.css";

export default function ConstructionPhotosNeedBetterRetrievalPage() {
  useEffect(() => {
    document.body.classList.add("loaded");
  }, []);

  return (
    <>
      <Head>
        <title>Construction Photos Need Better Retrieval — Danny Ohana</title>
        <meta
          name="description"
          content="Taking better construction photos is only half the problem. The full picture includes capturing useful metadata and making every photo easy to retrieve."
        />
        <link
          rel="canonical"
          href="https://www.dannyohana.com/construction-photos-need-better-retrieval"
        />
      </Head>

      <main className={styles.page}>
        <header className={styles.siteHeader}>
          <ProfileHomeButton />
        </header>

        <div className={styles.layout}>
          <article className={styles.article}>
            <ArticleHeader
              title="Construction Photos Need Better Retrieval"
              summary="Taking better photos is only half the problem. The other half is making them easy to find when they matter."
            />

            <div className={styles.body}>
              <figure className={styles.articleImage}>
                <Image
                  src="/artifacts/viewer-concept.webp"
                  alt="Construction photo viewer concept showing searchable project metadata"
                  width={2048}
                  height={1536}
                  layout="responsive"
                  priority
                />
              </figure>

              <p>
                Construction photos need better retrieval, not just better photos
                or better cameras. Most construction camera products focus on
                taking better photos, but the hard part begins five minutes after
                you take one.
              </p>

              <div className={styles.questions}>
                <p>Where was this taken?</p>
                <p>What drawing does it relate to?</p>
                <p>Will someone be able to find it six months to two years from now?</p>
                <p>
                  Is it good enough to cover our liability if someone blames us for
                  damage that was already there?
                </p>
              </div>

              <p>
                Capture is only half the problem. Capturing photos with useful
                metadata—and making those photos easy to retrieve—is the full
                picture.
              </p>
            </div>
          </article>
        </div>
      </main>

      <ReadNext currentUrl="/construction-photos-need-better-retrieval" />
    </>
  );
}
