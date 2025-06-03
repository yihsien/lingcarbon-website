// Central store for news items (replace dummy text as you go)
export interface NewsItem {
  slug: string;
  title: string;
  summary: string;
  date: string;           // ISO or human-readable
  hero: string;           // full-width image for story page
  bodyHtml: string;       // already-sanitised HTML or MD → HTML
}

export const allNews: NewsItem[] = [
  {
    slug: 'moe-ghg-emission-register-draft-announcement',
    title: '【國內政策】事業應盤查登錄溫室氣體排放量之排放源草案',
    summary:
      '環境部於 2/14 召開公聽會，就 1 月初公告草案廣納各界意見；指引預計 6 月底完成。',
    date: '2025-02-17',
    hero:
      'https://images.unsplash.com/photo-1594475668648-b63f9852d2b6?auto=format&fit=crop&w=1200&q=80',
    bodyHtml: `
      <p>環境部在上周五 (2/14) 針對一月初公告之
      「事業應盤查登錄溫室氣體排放量之排放源」草案進行公聽會，
      以廣納各界聲音，並預計今年 6 月底完成指引。</p>

      <p>草案預計擴大應進行碳盤查及登錄的對象，
      包含旅館業、運輸業、醫院、大專院校等機構，
      只要用電量達到一定標準皆將列管。
      但現階段受管制的企業雖需進行盤查，
      仍 <strong>不需查驗證</strong>，也 <strong>尚未納入碳費</strong>。</p>

      <p>若貴企業希望進一步盤點自身碳排放量，
      歡迎隨時聯絡「壹碳驗證」。</p>

      <p>🔗 <a href="https://netzero.cna.com.tw/news/202502140278/" target="_blank">中央社新聞報導</a><br/>
         🔗 <a href="https://drive.google.com/file/d/14LtPKBCL1EbRPkRlRBeIovHjyIJGOgPA/view" target="_blank">環境部會議簡報</a><br/>
         🔗 <a href="https://ghgregistry.moenv.gov.tw/epa_ghg/" target="_blank">事業溫室氣體排放量資訊平台</a></p>
    `,
  },
  {
    slug: 'seed-funding',
    title: 'LingCarbon Secures Seed Funding',
    summary:
      'Investment accelerates Scope 3 platform development and fuels regional expansion.',
    date: '2025-05-20',
    hero:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    bodyHtml: `
      <p>LingCarbon today announced the close of a USD 3 million seed round led by …</p>
      <h2>Why it matters</h2>
      <p>With new capital, LingCarbon will …</p>
    `,
  },
  /* add more objects … */
];