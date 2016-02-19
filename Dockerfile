FROM centos:7.2.1511
RUN yum install -y epel-release && yum -y clean all

RUN yum -y install \
  autoconf \
  automake \
  curl \
  gcc gcc-c++ make \
  git \
  glib2-devel \
  gobject-introspection-devel \
  gtk-doc \
  ImageMagick-devel \
  lcms2-devel \
  libexif-devel \
  libjpeg-turbo-devel \
  libpng-devel \
  libtiff-devel \
  libtoolize \
  libxml2-devel \
  libwebp-devel \
  orc-devel \
  swig \
  && yum -y clean all

ENV TARGET /usr/local
ENV VIPS_COMMIT 0a4991cbc096542ba90d976d1bcaebffc2ee1830
RUN mkdir /tmp/vips && \
  cd /tmp && \
  git clone https://github.com/jcupitt/libvips.git && \
  cd /tmp/libvips && \
  git checkout ${VIPS_COMMIT} && \
  ./bootstrap.sh && \
  ./configure --prefix=${TARGET} --enable-shared --disable-static \
             --disable-dependency-tracking --disable-debug \
             --disable-introspection --disable-pyvips8 --disable-gtk-doc \
             --without-pangoft2 --without-matio --without-cfitsio --without-openslide \
             --without-OpenEXR --without-gsf --without-python --without-fftw \
             --with-magick --with-orc --with-lcms --with-libwebp --with-zip --with-tiff \
             --with-png --with-jpeg --with-libexif && \
  make install-strip && \
  echo ${TARGET}/lib > /etc/ld.so.conf.d/vips.conf && \
  ldconfig

ENV VERSION_NODE 5.5.0
RUN mkdir /node && \
  curl -L https://nodejs.org/download/release/v${VERSION_NODE}/node-v${VERSION_NODE}-linux-x64.tar.gz | tar xzC /node --strip-components=1
ENV PATH /node/bin:$PATH

WORKDIR /app
ADD package.json /app/package.json
RUN npm install
ADD . /app
CMD node test
