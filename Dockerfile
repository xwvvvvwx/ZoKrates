FROM ubuntu:14.04

MAINTAINER JacobEberhardt <jacob.eberhardt@tu-berlin.de>, Dennis Kuhnert <dennis.kuhnert@campus.tu-berlin.de>

ARG rust_toolchain=nightly-2018-02-10
ARG libsnark_commit=master

WORKDIR /root/

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    curl \
    git \
    libboost-all-dev \
    libgmp3-dev \
    libprocps3-dev \
    libssl-dev \
    pkg-config \
    python-markdown

RUN git clone https://github.com/scipr-lab/libsnark.git
RUN cd libsnark && git checkout $libsnark_commit && git submodule update --init --recursive

RUN curl https://sh.rustup.rs -sSf | \
    sh -s -- --default-toolchain $rust_toolchain -y

ENV PATH=/root/.cargo/bin:$PATH

COPY . /root/ZoKrates
RUN  cd ZoKrates \
    && cargo build
