import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,
  CButton,
  CCol,
  CRow,
} from '@coreui/react'

// Dynamic base path for GitHub Pages
const publicUrl = import.meta.env.BASE_URL;

// 🧾 Mock articles data
const articles = [
    {
      id: 1,
      title: 'Huston Looks to Go Back to Back in 2026',
      publishedAt: '2025-11-10T09:00:00',
      imageUrl: `${publicUrl}photos/ZachSwinging.jpg`,
      summary:
        'Coming off a monumental TDS victory in 2025, the 32 year old Utahn feels that his best golf is still ahead. Find out why in our exclusive interview with the champ.',
      author: 'Tournament du Sol Media Team',
      content: `
  <p>After years of near-misses and heartbreak, Zach Huston finally broke through in 2025 — and he didn’t just win, he <em>dominated</em>. Now, as the 2026 Tournament du Sol looms, the reigning champion returns with one goal in mind: go back-to-back.</p>
  
  <p>For the first four years of TDS, Huston couldn’t quite get over the hump. Each season seemed to end the same way — flashes of brilliance followed by late-round struggles that kept him from reaching the prestigious TDS Final. His biggest critic wasn’t a journalist or fan, but his longtime rival and friend, Will Ghidotti, who loved to remind him, “<em>Make a TDS Final, then talk to me.</em>”</p>
  
  <p>Those words stuck.</p>
  
  <p>Heading into the 2025 tournament, Huston was laser-focused. “He showed up looking different,” one competitor said. “More composed. More confident. He wasn’t trying to play perfect golf — he was trying to play <em>his</em> golf.”</p>
  
  <p>And play it he did. Huston put on a clinic in consistency all week, carving up fairways and draining putts with surgical precision. By the time he reached the final at SilverRock Resort, his momentum was unstoppable. What began as a tense duel against Ghidotti turned into a runaway on the back nine — a statement round from a man on a mission.</p>
  
  <p>When the final putt dropped, Huston’s emotion was measured but unmistakable. At the champions’ dinner later that night at Castelli’s, he was asked about the win, his comeback, and his long rivalry with Ghidotti. Huston smiled, raised his glass, and delivered one of the most memorable one-liners in TDS history:</p>
  
  <p>“<em>Win</em> a TDS Final, then talk to me.”</p>
  
  <p>Now, one year later, the target is squarely on Huston’s back. But if 2025 taught us anything, it’s that Zach Huston doesn’t shy away from pressure — he thrives in it.</p>
  
  <p>The 2026 Tournament du Sol is shaping up to be one for the ages. And if Huston has his way, it may end the same way as last year: with the champ walking tall and a familiar smirk crossing his face.</p>
  `
    },
    {
        id: 2,
        title: 'Carpenter Eyes Redemption After La Purisima Nightmare',
        publishedAt: '2026-02-15T09:00:00',
        imageUrl: `${publicUrl}photos/AlexSwinging.jpg`,
        summary:
          'A two-time champion, a haunted putter, and unfinished business — Alex Carpenter enters 2026 determined to reclaim his place at the top of TDS.',
        author: 'Tournament du Sol Media Team',
        content: `
        <p>Few players in Tournament du Sol history have matched the sustained excellence of Alex Carpenter. A back-to-back champion in 2023 and 2024, Carpenter built a reputation as the tournament’s steadiest competitor — the kind of player who rarely beat himself and almost never blinked under pressure.</p>
      
        <p>His first title came in unforgettable fashion. Facing FJ O'Donnell at Eagle Falls in 2023, Carpenter stood on the final hole all square and needing something special. What followed was the stuff of TDS lore — a pure approach and a clutch birdie that flipped the match and delivered a 1 UP victory. It was a breakthrough moment that announced Carpenter as a force to be reckoned with.</p>
      
        <p>If 2023 was dramatic, 2024 was clinical. Carpenter squared off against Will Ghidotti and methodically dismantled him, capitalizing on his opponent's erratic drives and mistakes with relentless consistency. Fairways, greens, two putts — rinse and repeat. It wasn’t flashy, but it was dominant. Two years, two trophies.</p>
      
        <p>By the time the 2025 tournament approached, talk of a three-peat was everywhere. Analysts called him the safest pick in the field. Then came La Purisima.</p>
      
        <p>From the opening round, Carpenter’s putter went ice cold. Short misses piled up. Momentum vanished. Confidence disappeared. The normally unshakeable champion looked human. After day three, in a moment he later laughed about, Carpenter made an impulse stop at PGA Superstore and bought a brand-new putter, hoping for a spark.</p>
      
        <p>No spark came. The struggles stayed.</p>
      
        <p>La Purisima left a mark. “<em>I swear that place has it out for me,</em>” Carpenter said recently. “<em>I’ve had bad rounds before, but nothing like that. I love great courses, but La Purisima and I? We’re not on speaking terms.</em>”</p>

        <p>When asked for his thoughts on 2026 TDS course selections, Carpenter was emphatic in his response. “<em>I'll play anything that isn’t La Purisima. As long as it doesn’t involve La Purisima, I’m ok with it.</em>”</p>
      
        <p>Even so, counting Carpenter out would be a mistake. Teammates and competitors alike still call him the most consistent player TDS has seen. His track record proves it, and champions rarely stay down for long.</p>
      
        <p>As 2026 approaches, Carpenter isn’t talking about curses or equipment. He’s talking about preparation, patience, and getting back to the formula that made him great. A return to the TDS Final would surprise no one — and another trophy might surprise even fewer.</p>
        `
      },
      {
        id: 3,
        title: 'Ghidotti Chases Breakthrough After Back-to-Back Heartbreaks',
        publishedAt: '2026-02-17T20:00:00',
        imageUrl: `${publicUrl}photos/WillSwinging.jpg`,
        summary:
          'Electric, unpredictable, and always entertaining — Will Ghidotti returns to TDS 2026 still hunting the one prize that has eluded him.',
        author: 'Tournament du Sol Media Team',
        content: `
        <p>If there is one word competitors use to describe Will Ghidotti’s golf game, it’s <em>electric</em>. At any given moment, “Wedge Willy” can reach a par five in two and drain an eagle putt that leaves the group speechless. He can just as easily launch a 330-yard drive into what some now jokingly call the Bezosphere, sending the ball ricocheting down a wealthy Palm Desert street and into a backyard pool. With Ghidotti, you truly never know what’s coming next.</p>
      
        <p>What is certain is that he knows how to get to the big stage. Ghidotti has reached the TDS Final in each of the past two years — a feat few can claim. Yet the trophy has remained just out of reach, leaving him as the only active player without a victory in the finals.</p>
      
        <p>Ironically, the history of Tournament du Sol itself is tied to Ghidotti. It was Will who coined the tournament’s name ahead of the 2022 trip, a moment that helped shape the identity of the event as it exists today.</p>
      
        <p>The 2024 run was filled with drama. Ghidotti ultimately fell to Alex Carpenter in the final, but the night before he delivered one of the most clutch moments in TDS lore. On the 17th green at The Lights at Indio, putting in near darkness, Ghidotti buried a 15-footer that secured a championship bid for the SAAAAAMOOOOOOKAS squad and knocked the Nomadic Golfers into the third-place match. It was vintage Willy — fearless and theatrical.</p>
      
        <p>Then came 2025, a year many believed would finally be his. His short game took a massive leap forward, and fellow competitors watched in disbelief as he chipped in from everywhere. “<em>I can make 5 from anywhere,</em>” Ghidotti liked to say, but his golf game was challenging this mantra. Three consecutive rounds of 76 powered him straight into another TDS Final, this time against close friend and rival Zach Huston.</p>
      
        <p>Through nine holes at SilverRock, Ghidotti looked poised to change his story. He built a 2 UP lead and had all the momentum. But the back nine flipped the script. Huston stormed back, taking four straight holes in a dramatic swing. Ghidotti couldn’t stop the slide and ultimately fell 3 & 2.</p>
      
        <p>Even in defeat, his personality never fades. Whether declaring “<em>I’m ON vacation,</em>” shouting “<em>ONbelievable!</em>” after a wild shot, or delivering his favorite challenge — “<em>F**k a ten then talk to me,</em>” — Ghidotti remains one of the tournament’s great characters.</p>
      
        <p>Some competitors, including Huston, are quick to point out that Ghidotti has never closed the deal in a final. The question entering 2026 is simple: will this be the year Willy turns electric moments into a championship and finally gets the last word?</p>
        `
      }
      
      
  ]

const News = () => {
  const [expandedArticleId, setExpandedArticleId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedArticleId(expandedArticleId === id ? null : id)
  }

  // Sort newest to oldest
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  )

  return (
    <div className="p-4">
      <h2 className="text-center mb-4 fw-bold">Tournament du Sol News</h2>

      <CRow className="justify-content-center">
        {sortedArticles.map((article) => (
          <CCol md={8} key={article.id} className="mb-4">
            <CCard className="shadow-sm border-0">
              <CCardImage
                orientation="top"
                src={article.imageUrl}
                style={{ objectFit: 'cover', height: '280px' }}
              />
              <CCardBody>
                <CCardTitle className="fw-bold fs-4 mb-2">
                  {article.title}
                </CCardTitle>
                <p className="text-muted mb-1">
                  By {article.author} •{' '}
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>

                {expandedArticleId === article.id ? (
  <div
  className="mt-3"
  style={{ lineHeight: '1.6', fontSize: '1rem' }}
  dangerouslySetInnerHTML={{ __html: article.content.trim() }}
></div>
) : (
  <CCardText className="mt-3">{article.summary}</CCardText>
)}


                <div className="text-center mt-3">
                  <CButton
                    color="secondary"
                    variant="outline"
                    onClick={() => toggleExpand(article.id)}
                  >
                    {expandedArticleId === article.id ? 'Show Less' : 'Read More'}
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </div>
  )
}

export default News
