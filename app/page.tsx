"use client";
import React, { useState } from "react";
import Image from "next/image";
import Layout from "@/components/Layout";
import pimHomeImage from "@/public/Large.png";
import image1 from "@/public/image1.png";
import image2 from "@/public/image2.png";
import image3 from "@/public/image3.png";

// Import the necessary CSS for the slick carousel

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"; // Import the slider library
import { Box } from "@mui/material";
import Contract from "./post/page";

const Page: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<"contract">("contract");
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite scroll
    speed: 500,
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable auto play
    autoplaySpeed: 3000, // Delay between slides in milliseconds
    fade: true, // Enable fade effect for smoother transitions
  };

  return (
    <Layout>
      {/* Background Image Section */}
      <Box display="flex" justifyContent="center">
        <Box position="relative" width="100%" minWidth="auto">
          <Image
            src={pimHomeImage}
            alt="Pim Home image description"
            layout="responsive"
            width={1800}
            height={600}
            objectFit="contain"
          />
        </Box>
      </Box>

    {/* Text Section */}
      <h1 className="text-c  enter text-xl font-bold mt-8">
        “พีไอเอ็ม สมาร์ท” กองทุนเพื่อชีวิตฯ ที่ให้มากกว่าทุนการศึกษา
      </h1>
      <p className="text-center px-4 lg:px-0">
        หนึ่งสิ่งสำคัญในการสร้าง “ความสำเร็จทางการศึกษา” คือ “การมอบโอกาส”
        เพื่อต่อยอดความฝันให้เยาวชนทุกกลุ่มได้เข้าถึงการศึกษาอย่างเท่าเทียม
        สิ่งเหล่านี้ถือเป็นมิติสำคัญเพื่อเพิ่มขีดความสามารถทางการแข่งขันให้เยาวชน
        ได้คำนึงถึงคุณค่าของตัวเองในฐานะบุคลากรของชาติ...
        <a
          href="https://www.facebook.com/pimsmartfanpage"
          className="text-blue-500 hover:underline"
        >
          เพิ่มเติม
        </a>
      </p>

      {/* Slider Section */}
      <Box position="relative" mx="auto" mt={10} boxShadow={3} width="100%" maxWidth="1500px">
        <Slider {...settings}>
          {/* Slide 1 */}
          <Box display="flex" alignItems="center" justifyContent="center" height="400px">
            <Box width="100%">
              <Box position="relative" width="100%" height="auto">
                <Image
                  src={image1}
                  alt="Slide 1"
                  layout="responsive"
                  width={400}
                  height={300}
                  objectFit="contain"
                  className="rounded-md"
                />
              </Box>
              <Box textAlign="center" mt={4} p={4}>
                <p className="text-gray-600">กองทุนเพื่อชีวิตแห่งการเรียนรู้...</p>
              </Box>
            </Box>
          </Box>

          {/* Slide 2 */}
          <Box display="flex" alignItems="center" justifyContent="center" height="400px">
            <Box width="100%">
              <Box position="relative" width="100%" height="auto">
                <Image
                  src={image2}
                  alt="Slide 2"
                  layout="responsive"
                  width={400}
                  height={300}
                  objectFit="contain"
                  className="rounded-md"
                />
              </Box>
              <Box textAlign="center" mt={4} p={4}>
                <p className="text-gray-600">ไฮไลท์ในครั้งนี้ ศิษย์เก่าที่จบจากจังหวัดเชียงใหม่...</p>
              </Box>
            </Box>
          </Box>

          {/* Slide 3 */}
          <Box display="flex" alignItems="center" justifyContent="center" height="400px">
            <Box width="100%">
              <Box position="relative" width="100%" height="auto">
                <Image
                  src={image3}
                  alt="Slide 3"
                  layout="responsive"
                  width={400}
                  height={300}
                  objectFit="contain"
                  className="rounded-md"
                />
              </Box>
              <Box textAlign="center" mt={4} p={4}>
                <p className="text-gray-600">ทางกองทุนเพื่อชีวิตแห่งการเรียนรู้มอบทุนการศึกษา...</p>
              </Box>
            </Box>
          </Box>
        </Slider>
      </Box>

      {/* CTA Section */}
      {selectedForm === "contract" && (
        <Box sx={{ marginTop: 5 , margin: 5}}>
          <Contract />
        </Box>
      )}
    </Layout>
  );
};

export default Page;
