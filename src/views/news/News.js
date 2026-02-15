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

// 🧾 Mock articles data
const articles = [
    {
      id: 1,
      title: 'Huston Looks to Go Back to Back in 2026',
      publishedAt: '2025-11-10T09:00:00',
      imageUrl: 'src/assets/images/ZachSwinging.jpg',
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
