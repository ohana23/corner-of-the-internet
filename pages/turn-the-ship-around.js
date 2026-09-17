import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import ProfileHomeButton from "../components/ProfileHomeButton";
import ReadNext from "../components/ReadNext";
import ArticleHeader from "../components/ArticleHeader";
import styles from "../writing-article.module.css";

export default function TurnTheShipAroundPage() {
  useEffect(() => {
    document.body.classList.add("loaded");
  }, []);

  return (
    <>
      <Head>
        <title>Notes on Turn the Ship Around! — Danny Ohana</title>
        <meta
          name="description"
          content="Reading notes on L. David Marquet’s Turn the Ship Around! and what it teaches about authority, trust, and building leaders."
        />
        <link
          rel="canonical"
          href="https://www.dannyohana.com/turn-the-ship-around"
        />
      </Head>

      <main className={styles.page}>
        <header className={styles.siteHeader}>
          <ProfileHomeButton />
        </header>

        <div className={styles.layout}>
          <article className={styles.article}>
            <ArticleHeader
              eyebrow="March 28, 2025"
              title="Notes on Turn the Ship Around!"
              summary="Leadership works better when people don’t wait to be told what to do."
            />

            <div className={styles.body}>
              <figure className={`${styles.articleImage} ${styles.bookCover}`}>
                <Image
                  src="/turn-the-ship-around-cover.jpg"
                  alt="Cover of Turn the Ship Around! by L. David Marquet"
                  width={914}
                  height={1400}
                  layout="responsive"
                  priority
                />
              </figure>

              <p>
                I read <em>Turn the Ship Around!</em> by L. David Marquet, about
                his time commanding the USS <em>Santa Fe</em>. These are the
                ideas I kept coming back to.
              </p>

              <h2>Volunteering</h2>

              <p>
                A person’s genius, passion, loyalty, and tenacious creativity can
                only be volunteered. You can order compliance. You can’t order
                someone to care.
              </p>

              <p>
                The world’s biggest problems will be solved by passionate people
                who are free to bring all of themselves to the work.
              </p>

              <h2>Empowering others</h2>

              <p>
                Marquet writes that attempts to empower him felt like
                manipulation. The word itself assumes one person holds the power
                and gets to decide when somebody else can have it.
              </p>

              <p>
                His argument is that people are naturally empowered. Most
                organizations have just spent a long time actively disempowering
                them.
              </p>

              <blockquote className={styles.quote}>
                <p>“Do you need someone to empower you?”</p>
              </blockquote>

              <h2>Leaders can be wrong</h2>

              <p>
                The story that landed hardest for me happens when Marquet orders
                “ahead two-thirds” on a submarine that doesn’t have that setting.
                The officer repeats and affirms the order anyway.
              </p>

              <p>
                When Marquet asks why, the officer tells him it was because the
                captain said so. He assumed Marquet must have learned something
                secret in commanding officer school that only captains knew.
              </p>

              <p>
                When the leader is wrong, everybody can follow them right off a
                cliff.
              </p>

              <div className={styles.questions}>
                <p>
                  Can you remember a time when someone followed your order
                  because they assumed you knew something reserved for
                  executives? Or a time when you followed an order because you assumed the
                  person giving it knew something you didn’t?
                </p>
              </div>

              <h2>Excellence</h2>

              <p>
                On the ship, the goal had become avoiding mistakes instead of
                achieving excellence.
              </p>

              <p>
                That’s an important distinction. If avoiding mistakes is the
                goal, the safest thing to do is wait for instructions. If
                excellence is the goal, you have to think for yourself.
              </p>

              <h2>Working as a team</h2>

              <p>
                People said submarining was a team sport, but in practice it
                often looked like a group of individuals working inside their own
                shells.
              </p>

              <p>
                Marquet’s crew worked to change that. Everyone was encouraged to
                say what they saw and thought, what they believed, what they were
                skeptical or worried about, and what they hoped would happen
                next.
              </p>

              <blockquote className={styles.quote}>
                <p>“Lack of certainty is strength and certainty is arrogance.”</p>
              </blockquote>

              <p>
                That feels like the difference between a group that simply
                divides up work and a group that actually thinks together.
              </p>

              <h2>Leader-leader</h2>

              <p>
                Later in the book, Marquet describes his crew preparing for
                people who were about to come aboard cold, wet, hungry, and
                possibly injured. Almost none of the preparation happened because
                he ordered it. People saw what would be needed, got ready, and
                informed the right people.
              </p>

              <p>
                They didn’t wait for permission. They did what needed to be done.
                That was the leader-leader model working all the way through the
                crew.
              </p>

              <blockquote className={styles.quote}>
                <p>“Don’t have meetings. Have conversations.”</p>
              </blockquote>

              <h2>Don’t try to be missed</h2>

              <p>
                Most leaders want to be missed after they leave. It feels like
                proof that they mattered. Marquet’s point is almost the opposite.
              </p>

              <p>
                If the team falls apart when you leave, you haven’t built a
                strong team. You’ve built dependence. The better goal is to leave
                behind people who can keep making good decisions without you.
              </p>

              <p>
                <a
                  href="https://www.penguinrandomhouse.com/books/314163/turn-the-ship-around-by-l-david-marquet/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more about Turn the Ship Around! by L. David Marquet.
                </a>
              </p>
            </div>
          </article>
        </div>
      </main>

      <ReadNext currentUrl="/turn-the-ship-around" />
    </>
  );
}
