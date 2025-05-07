import React from 'react';
import './Certificate.scss';
import certificate1Img from '../../../public/assets/Fotolar/sertifikat1.jpg';
import certificate2Img from '../../../public/assets/Fotolar/sertifikat2.jpg';
import journal1Img from './assets/journal1.jpg';

import certificate2Pdf from './assets/certificate2.pdf';
import journal1Pdf from './assets/journal1.pdf';

const CertificatesSection = () => {
  const items = [
    {
      id: 1,
      title: 'Sertifikat 1',
      imageUrl: certificate1Img,
      pdfUrl: certificate1Pdf
    },
    {
      id: 2,
      title: 'Sertifikat 2',
      imageUrl: certificate2Img,
      pdfUrl: certificate2Pdf
    },
    {
      id: 3,
      title: 'Jurnal 1',
      imageUrl: journal1Img,
      pdfUrl: journal1Pdf
    }
  ];

  return (
    <section className="certificatesSection">
      <h2 className="sectionTitle">Sertifikatlar və Jurnallar</h2>
      <div className="itemsGrid">
        {items.map((item) => (
          <div key={item.id} className="itemCard">
            <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="itemPreview"
              />
              <h3 className="itemTitle">{item.title}</h3>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CertificatesSection;