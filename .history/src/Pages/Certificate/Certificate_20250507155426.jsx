import React from 'react';
import './Certificate.scss';
import certificate1 from '../../../public/assets/Fotolar/sertifikat1.pdf';
import certificate2 from './assets/certificate2.pdf';
import certificate3 from './assets/certificate3.pdf';

const CertificatesSection = () => {
  const certificates = [
    {
      id: 1,
      title: 'Sertifikat 1',
      pdfUrl: certificate1
    },
    {
      id: 2,
      title: 'Sertifikat 2',
      pdfUrl: certificate2
    },
    {
      id: 3,
      title: 'Sertifikat 3',
      pdfUrl: certificate3
    }
  ];

  return (
    <section className="certificatesSection">
      <h2 className="sectionTitle">Sertifikatlarımız</h2>
      <div className="certificatesGrid">
        {certificates.map((cert) => (
          <div key={cert.id} className="certificateCard">
            <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer">
              <embed
                src={cert.pdfUrl}
                type="application/pdf"
                className="certificatePreview"
              />
              <h3 className="certificateTitle">{cert.title}</h3>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CertificatesSection;