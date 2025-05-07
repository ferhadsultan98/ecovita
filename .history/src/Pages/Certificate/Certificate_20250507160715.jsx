import React from 'react';
import './Certificate.scss';
import certificate1Img from '../../../public/assets/Fotolar/sertifikat1.jpg';
import certificate2Img from '../../../public/assets/Fotolar/sertifikat2.jpg';
import certificate3Img from '../../../public/assets/Fotolar/sertifikat3.jpg';
import Journal1Img from '../../../public/assets/Fotolar/jurnal/Heyvandarliq jurnal pdf-1-1.jpg';
import Journal2Img from '../../../public/assets/Fotolar/jurnal/Heyvandarliq jurnal pdf-2-1.jpg';
import Journal3Img from '../../../public/assets/Fotolar/jurnal/Heyvandarliq jurnal pdf-3-1.jpg';
import Journal4Img from '../../../public/assets/Fotolar/jurnal/Heyvandarliq jurnal pdf-4-1.jpg';
import Journal5Img from '../../../public/assets/Fotolar/jurnal/Heyvandarliq jurnal pdf-5-1.jpg';
import Journal6Img from '../../../public/assets/Fotolar/jurnal/Heyvandarliq jurnal pdf-6-1.jpg';
import Journal7Img from '../../../public/assets/Fotolar/jurnal/Heyvandarliq jurnal pdf-7-1.jpg';


const CertificatesSection = () => {
  const items = [
    {
      id: 1,
      title: 'Sertifikat 1',
      imageUrl: certificate1Img,

    },
    {
      id: 2,
      title: 'Sertifikat 2',
      imageUrl: certificate2Img,

    },
    {
      id: 3,
      title: 'Sertifikat 3',
      imageUrl: certificate3Img,

    },
    {
      id: 4,
      title: 'Jurnal 1',
      imageUrl: Journal1Img,

    },
    {
      id: 4,
      title: 'Jurnal 2',
      imageUrl: Journal2Img,

    },
    {
      id: 4,
      title: 'Jurnal 3',
      imageUrl: Journal1Img,

    },
    {
      id: 4,
      title: 'Jurnal 4',
      imageUrl: certificate3Img,

    },
    {
      id: 4,
      title: 'Jurnal 5',
      imageUrl: certificate3Img,

    },
    {
      id: 4,
      title: 'Jurnal 6',
      imageUrl: certificate3Img,

    },
    {
      id: 4,
      title: 'Jurnal 7',
      imageUrl: certificate3Img,

    }
    
  ];

  return (
    <section className="certificatesSection">
      <h2 className="sectionTitle">Sertifikatlar və Jurnallar</h2>
      <div className="itemsGrid">
        {items.map((item) => (
          <div key={item.id} className="itemCard">
       
              <img
                src={item.imageUrl}
                alt={item.title}
                className="itemPreview"
              />
              <h3 className="itemTitle">{item.title}</h3>
     
          </div>
        ))}
      </div>
    </section>
  );
};

export default CertificatesSection;