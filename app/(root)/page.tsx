import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";

function Hero() {
  return (
    <section className="overflow-x-hidden">
      <div className="container py-20">
        <div className="flex">
          <div className="basis-full pb-32 pt-16 text-center md:basis-2/5 md:pt-20 md:text-left">
            <h1 className="text-3xl font-bold">
              <span className="text-gradient-brand">Enhance</span> Your Coding
              Journey
            </h1>
            <p className="mt-4">
              Generate quizzes with technical-related questions, tailored to
              your liking
            </p>
            <Link
              href="/quiz/generate"
              className="button button--primary mt-8 inline-block w-48 self-start text-center"
            >
              Get Started
            </Link>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            animate={{ x: [1000, 0], transition: { duration: 0.8 } }}
            className="relative -ml-16 hidden basis-2/5 md:ml-0 md:block md:basis-3/5"
          >
            <div className="absolute left-0 top-0">
              <div className="form-shadow flex w-[580px] translate-x-20 flex-col items-center justify-center rounded-2xl border-2 border-white bg-background-light px-20 py-12">
                <div className="flex h-3 w-full gap-3">
                  <div className="h-full w-4 bg-indigo-100/50"></div>
                  <div className="h-full w-16 bg-indigo-100/50"></div>
                  <div className="h-full w-12 bg-indigo-100/50"></div>
                </div>
                <div className="mt-4 flex h-4 w-full gap-3">
                  <div className="h-full w-24 bg-indigo-200"></div>
                  <div className="h-full w-5 bg-indigo-200"></div>
                  <div className="h-full w-12 bg-indigo-200"></div>
                  <div className="h-full w-24 bg-indigo-200"></div>
                </div>
                <div className="mt-8 flex w-full flex-col gap-2">
                  <div className="form-shadow flex w-full items-center gap-2 rounded-md border-2 border-white bg-background-light px-2 py-1 transition duration-100 ease-out hover:-translate-y-1">
                    <div className="aspect-square h-6 rounded-full border-2 border-green-200 bg-green-300"></div>
                    <div className="flex h-3 gap-2">
                      <div className="h-full w-4 bg-green-300"></div>
                      <div className="h-full w-12 bg-green-300"></div>
                    </div>
                  </div>
                  <div className="form-shadow flex w-full items-center gap-2 rounded-md border-2 border-white bg-background-light px-2 py-1 transition duration-100 ease-out hover:-translate-y-1">
                    <div className="aspect-square h-6 rounded-full border-2 border-red-300 bg-red-400"></div>
                    <div className="flex h-3 gap-2">
                      <div className="h-full w-12 bg-red-400"></div>
                      <div className="h-full w-16 bg-red-400"></div>
                    </div>
                  </div>
                  <div className="form-shadow flex w-full items-center gap-2 rounded-md border-2 border-white bg-background-light px-2 py-1 transition duration-100 ease-out hover:-translate-y-1">
                    <div className="aspect-square h-6 border-2 border-transparent"></div>
                    <div className="flex h-3 gap-2">
                      <div className="h-full w-12 bg-indigo-200"></div>
                      <div className="h-full w-12 bg-indigo-200"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 h-10 w-32 rounded-md border-b-2 border-indigo-300 bg-indigo-100/50 transition duration-100 ease-out hover:translate-y-[1px] hover:border-none"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="bg-indigo-100/50">
      <div className="container pb-28 pt-20">
        <h2 className="text-center text-3xl font-bold">What to Expect?</h2>
        <div className="mt-8 flex flex-col justify-between gap-8 md:mt-20 md:flex-row">
          <motion.div
            animate={{
              opacity: [0, 1],
              y: [300, 0],
              transition: { duration: 0.8, delay: 0.4 },
            }}
            className="form-shadow relative flex basis-1/3 items-center gap-4 rounded-md border border-white bg-background-light p-4 md:block"
          >
            <div className="input-shadow left-1/2 mx-auto w-32 rounded-full bg-background-light p-4 md:absolute md:-translate-x-1/2 md:-translate-y-1/2">
              <Image
                src="/icons/ion_options.svg"
                width={100}
                height={100}
                alt="Options Icon"
              />
            </div>
            <div className="text-left md:mt-16 md:p-4 md:text-center">
              <p className="text-xl font-bold">User-Friendly</p>
              <p className="text-slate-600">
                A simple and clean design makes it easy to navigate and create
                quizzes without any hassle.
              </p>
            </div>
          </motion.div>
          <motion.div
            animate={{
              opacity: [0, 1],
              y: [300, 0],
              transition: { duration: 0.8, delay: 0.7 },
            }}
            className="form-shadow relative flex basis-1/3 items-center gap-4 rounded-md border border-white bg-background-light p-4 md:block"
          >
            <div className="input-shadow left-1/2 mx-auto w-32 rounded-full bg-background-light p-4 md:absolute md:-translate-x-1/2 md:-translate-y-1/2">
              <Image
                src="/icons/ion_bulb-sharp.svg"
                width={100}
                height={100}
                alt="Lightbulb Icon"
              />
            </div>
            <div className="text-left md:mt-16 md:p-4 md:text-center">
              <p className="text-xl font-bold">Generate Quizzes</p>
              <p className="text-slate-600">
                Use our intuitive form to generate quizzes that suit your
                interests and skill level.
              </p>
            </div>
          </motion.div>
          <motion.div
            animate={{
              opacity: [0, 1],
              y: [300, 0],
              transition: { duration: 0.8, delay: 1 },
            }}
            className="form-shadow relative flex basis-1/3 items-center gap-4 rounded-md border border-white bg-background-light p-4 md:block"
          >
            <div className="input-shadow left-1/2 mx-auto w-32 rounded-full bg-background-light p-4 md:absolute md:-translate-x-1/2 md:-translate-y-1/2">
              <Image
                src="/icons/ion_color-wand-outline.svg"
                width={100}
                height={100}
                alt="Options Icon"
              />
            </div>
            <div className="text-left md:mt-16 md:p-4 md:text-center">
              <p className="text-xl font-bold">Edit & Personalize</p>
              <p className="text-slate-600">
                Make your quizzes truly yours! Edit questions and create a
                learning experience that fits your preferences.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section>
      <div className="container flex flex-col items-center justify-center gap-4 py-16">
        <h2 className="text-center text-3xl font-bold">Start Your Journey!</h2>
        <Link
          href="/sign-up"
          className="button button--primary w-48 text-center"
        >
          Sign Up
        </Link>
      </div>
    </section>
  );
}

async function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}

export default Home;
