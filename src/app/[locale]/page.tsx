import { useTranslations } from 'next-intl';


export default function Page() {
  const t = useTranslations('site');

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      page
    </section>
  );
}
