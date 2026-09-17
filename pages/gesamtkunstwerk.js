import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import ProfileHomeButton from "../components/ProfileHomeButton";
import ReadNext from "../components/ReadNext";
import ArticleHeader from "../components/ArticleHeader";
import styles from "../writing-article.module.css";

export default function GesamtkunstwerkPage() {
  useEffect(() => {
    document.body.classList.add("loaded");
  }, []);

  return (
    <>
      <Head>
        <title>Gesamtkunstwerk, or “A Complete Work” — Danny Ohana</title>
        <meta
          name="description"
          content="What Elden Ring, Apple, and other complete works can teach us about restraint, coherence, and creative direction."
        />
        <link
          rel="canonical"
          href="https://www.dannyohana.com/gesamtkunstwerk"
        />
      </Head>

      <main className={styles.page}>
        <header className={styles.siteHeader}>
          <ProfileHomeButton />
        </header>

        <div className={styles.layout}>
          <article className={styles.article}>
            <ArticleHeader
              eyebrow="April 2, 2025"
              title="Gesamtkunstwerk, or “A Complete Work”"
              summary="FromSoftware's Elden Ring, Apple, and how the best work feels coherent down to the last detail."
            />

            <div className={styles.body}>
              <p>
                I’ve been reading about the concept of <em>Gesamtkunstwerk</em>
                —a German word usually translated as “a total work of art,” or,
                more simply, “a complete work.” As I understand it, it describes
                a project that holds on to its themes down to the last detail.
              </p>

              <p>
                <em>Elden Ring</em> is a Gesamtkunstwerk. I just recently played it after taking a decade-long break from gaming
                and never experienced anything like it. It feels like an entire
                project, with every detail considered to the last animation and pixel. It's a masterpiece to say the least.
                Part of what makes that possible is restraint. Cutting scope
                gives you more time to focus on the details of what you’ve chosen
                to make.
              </p>



              <figure className={styles.articleImage}>
                <Image
                  src="/elden-ring-key-art.jpg"
                  alt="Elden Ring artwork showing a warrior beneath the glowing Elden Ring"
                  width={1600}
                  height={900}
                  layout="responsive"
                  priority
                />
              </figure>

              <p>I wrote about this in a recent journal entry:</p>

              <blockquote className={styles.quote}>
                <p>
                  Their games benefit from reduced scope. Here are some things other games do that they haven’t done or decided are not crucial to a great experience:
                </p>

                <ul>
                  <li>Scenes with long dialogue</li>
                  <li>Talkative protagonists while you’re playing</li>
                  <li>Dialogue that explains everything that’s happening</li>
                  <li>Talkative NPCs</li>
                  <li>Difficulty settings</li>
                  <li>Ultra-high-fidelity or realistic graphics</li>
                  <li>
                  Fancy menu systems with high quality graphics and motion design (their menus are pretty industrial and have been basically the same across most of their games. Their maps seem mostly hand drawn too.)
                  </li>
                  <li>
                    Completely revamped combat and item systems every time there
                    is a sequel
                  </li>
                  <li>Completely new assets and animations for every sequel</li>
                  <li>Robust tutorials</li>
                  <li>Minimal systems</li>
                  <li>Quest logs and objective markers</li>
                  <li>Procedurally generated content</li>
                  <li>Morality systems</li>
                </ul>
              </blockquote>

              <p>
                It's not that this list is meant to illustrate what their games lack.
                It's about understanding what they've chosen to cut. If they can cut
                things, they can protect what they truly care about with fervor.
                FromSoftware (the development studio) and Hidetaka Miyazaki (the game's director)
                don't need to chase every new convention because they know what kind of experience
                they're trying to make.
              </p>

              <p>
                Hidetaka Miyazaki calls his approach “total direction.” A
                New Yorker profile describes him weighing in on everything from
                the buttons on a costume to the angle of a hillside, along with
                fonts, menu layouts, and character movements. The details can be
                very different from one another, but they all pass through the
                same point of view.
              </p>

              <p>
                The same idea applies to Apple, my personal favorite product company (I know, how unique am I?).
                Steve Jobs and, in a different way, Jony Ive, acted as a final gate for what the company showed
                the public. Products, packaging, apps, commercials, and
                billboards all had to feel like they came from the same place. That job is easier when
                work bubbles up to and has to be approved by a very small cohort.
              </p>

              <p>
                Every masterful novel is a Gesamtkunstwerk. Every masterful film
                and video game is, too. Disney was an early example of the idea
                applied to a theme park. In each case, someone or a small group
                of people makes sure the final result is coherent and
                aligns with the <em>original vision</em>.
              </p>

              <p>
                In simple terms, you need a very small group, even just one individual, who completely understands what everyone is going for.
              </p>

              <p>
                That doesn’t mean nobody else gets a voice. Miyazaki has said
                that his influence can make people reluctant to disagree, so he
                tries to be open about his own mistakes and create enough trust
                for honest feedback. A complete work still takes many people.
                The important thing is that they’re building toward the same
                idea.
              </p>

              <p>
                I'll end this with an excerpt from the New Yorker profile of Miyazaki:
              </p>

              <blockquote className={styles.quote}>
                <p>
                  By his own admission, Miyazaki is a micromanager. He calls his method “total direction,” and he can provide input on anything from the style of a costume’s buttons to the precise angle of a plunging hillside. “I’ve learned so many things from Miyazaki,” Masanori Waragai, a concept artist, told me, in 2015. “Too many to mention.” Miyazaki has opinions on fonts, on menu layouts. He’s even performed movements for animators, acting out sequences that are mimed by a game’s characters.</p>
                <p>
                  It’s unusual for such a figure to be company director: the demands of running a business can easily smother creative endeavors. But Miyazaki sees himself as an outsider in the managerial class; he observes fellow-C.E.O.s like an anthropologist, joking that he sometimes uses them as inspiration for his monsters. He’s also a nurturing boss—his team routinely calls him for personal advice—and is acutely aware of the hazards of the empowered auteur. “The thing I prize is total openness from the staff; I try to be frank about my own mistakes,” he said. “Because of my influence over these games, people are often reluctant to give their honest opinion, even when it may matter most. So I try not to let pride get involved, and try to create trust.
                </p>
              </blockquote>

              <p>
                <a
                  href="https://www.newyorker.com/culture/persons-of-interest/hidetaka-miyazaki-sees-death-as-a-feature-not-a-bug"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read Simon Parkin’s New Yorker profile of Hidetaka Miyazaki.
                </a>
              </p>
            </div>
          </article>
        </div>
      </main>

      <ReadNext currentUrl="/gesamtkunstwerk" />
    </>
  );
}
