'use client'

import Link from 'next/link'
import classes from './page.module.css'
import ImageSlideshow from '@/components/images/image-slideshow'

export default function Home () {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.slideshow}>
          <ImageSlideshow />
        </div>
        <div>
          <div className={classes.hero}>
            <h1>NextLevel Food for NextLevel Foodies</h1>
            <p>Taste & share food from all over the world</p>
          </div>
          <div className={classes.cta}>
            <Link href='/community'>Join the Community</Link>
            <Link href='/meals'>Explore Meals</Link>
          </div>
        </div>
      </header>
      <main>
        <section className={classes.section}>
          <h2>How it works</h2>
          <p>
            NextLevel Food is a platform for foodies to share their favorite
            recipes with the world. It&apos;s a place to discover new dishes,
            and to connect with other food lovers.
          </p>
          <p>
            NextLevel Food is a place to discover new dishes, and to connect
            with other food lovers.
          </p>
        </section>

        <section className={classes.section}>
          <h2>Why NextLevel Food?</h2>
          <p>
            At <strong>NextLevel Food</strong>, we believe that food is more
            than just a meal—it&apos;s an experience, a memory, and a way to
            connect with people. Here’s why you’ll love being part of our
            community:
          </p>

          <ul>
            <li>
              <strong>🍽️ Endless Inspiration –</strong> Discover unique and
              mouth-watering recipes shared by food lovers from around the
              world.
            </li>
            <br />
            <li>
              <strong>👨‍🍳 Share Your Creations –</strong> Have a secret family
              recipe or a personal favorite? Share it with others and inspire
              the next home chef!
            </li>
            <br />
            <li>
              <strong>🤝 Engage with a Passionate Community –</strong> Connect
              with fellow food enthusiasts, exchange tips, and discuss your
              favorite cuisines.
            </li>
            <br />
            <li>
              <strong>🔎 Easy to Explore –</strong> Whether you&apos;re looking
              for a quick snack, a gourmet meal, or a healthy dish, our
              intuitive platform helps you find the perfect recipe.
            </li>
            <br />
            <li>
              <strong>🚀 Take Your Cooking to the Next Level –</strong> Learn
              new techniques, experiment with flavors, and elevate your culinary
              skills.
            </li>
            <br />
          </ul>
        </section>
      </main>
    </>
  )
}
