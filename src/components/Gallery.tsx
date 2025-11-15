import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    {
      url: 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg',
      title: 'Hair Coloring',
      category: 'Before & After'
    },
    {
      url: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg',
      title: 'Haircut & Style',
      category: 'Before & After'
    },
    {
      url: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg',
      title: 'Balayage Highlights',
      category: 'Before & After'
    },
    {
      url: 'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg',
      title: 'Nail Art',
      category: 'Before & After'
    },
    {
      url: 'https://images.pexels.com/photos/457701/pexels-photo-457701.jpeg',
      title: 'Bridal Makeup',
      category: 'Before & After'
    },
    {
      url: 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg',
      title: 'Special Event Makeup',
      category: 'Before & After'
    },
    {
      url: 'https://images.pexels.com/photos/3985321/pexels-photo-3985321.jpeg',
      title: 'Facial Treatment',
      category: 'Salon'
    },
    {
      url: 'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg',
      title: 'Eyebrow Styling',
      category: 'Before & After'
    },
    {
      url: 'https://images.pexels.com/photos/7755257/pexels-photo-7755257.jpeg',
      title: 'Eyelash Extensions',
      category: 'Before & After'
    }
  ];

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-rose-400" />
            <span className="text-rose-500 text-sm uppercase tracking-wider font-medium">
              Galeria
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
            O Nosso Belo Trabalho
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore o nosso portfólio de transformações incríveis e inspire-se para a sua próxima visita.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-xs text-rose-300 mb-1">{image.category}</div>
                  <div className="text-lg font-semibold">{image.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full p-3 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-4 text-white hover:bg-white/10 rounded-full p-3 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 text-white hover:bg-white/10 rounded-full p-3 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-5xl w-full">
            <img
              src={galleryImages[selectedImage].url}
              alt={galleryImages[selectedImage].title}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <div className="text-center mt-6">
              <div className="text-rose-300 text-sm mb-1">
                {galleryImages[selectedImage].category}
              </div>
              <div className="text-white text-xl font-semibold">
                {galleryImages[selectedImage].title}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
