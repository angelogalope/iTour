import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faBook, faSearch, faEllipsisH, faArrowLeft, } from '@fortawesome/free-solid-svg-icons';
import "aframe";
import "aframe-extras";

const TourScreen = () => {
  const [imageSrc, setImageSrc] = useState("/images/gate.jpg");
  const lastTapRef = useRef(0);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  }

  if (AFRAME) {
    delete AFRAME.systems['arjs'];
    delete AFRAME.components['arjs'];
    delete AFRAME.components['arjs-camera'];
    delete AFRAME.components['marker'];
    delete AFRAME.components['gps-camera'];
    delete AFRAME.components['location-based'];
  }

  // useEffect(() => {
  //   // Clean up AR.js globals *before* scene renders
  //   if (AFRAME) {
  //     delete AFRAME.systems['arjs'];
  //     delete AFRAME.components['arjs'];
  //     delete AFRAME.components['arjs-camera'];
  //     delete AFRAME.components['marker'];
  //     delete AFRAME.components['gps-camera'];
  //     delete AFRAME.components['location-based'];
  //   }

  //   // Now it's safe to render the scene
  //   setReady(true);
  // }, []);


  useEffect(() => {
    const player = document.getElementById("rig");

    const resetPosition = (player, rotationY) => {
      player.setAttribute("position", { x: 0, y: 1.6, z: 0 }); // Default position
      player.setAttribute("rotation", { x: 0, y: rotationY, z: 0 });
    };

    const checkPosition = () => {
      if (!player) return;
      const position = player.getAttribute("position");

      //Outside the CSU Main Gate
      if (position.x <= -5 && imageSrc === "/images/gate.jpg") {
        setImageSrc("/images/inside-gate.jpg");
        resetPosition(player, 95);
      } 
      //End of CSU Main Gate

      //Inside Main Gate
      if (imageSrc === "/images/inside-gate.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/gate.jpg");
          resetPosition(player, 80);
        }
        if (position.x <= -5) {
          setImageSrc("/images/ced-hallway.jpg");
          resetPosition(player, 100);
        }
        if (position.z > 5) {
          setImageSrc("/images/gate-ced.jpg");
          resetPosition(player, 20);
        }
        if (position.z < -5 && position.x < -3) {
          setImageSrc("/images/gate-caa.jpg");
          resetPosition(player, 120);
        }
      }
      //End of Inside Main Gate

      //College of Education
      if (imageSrc === "/images/gate-ced.jpg") {
        if (position.z >= 5) {
          setImageSrc("/images/inside-gate.jpg");
          resetPosition(player, 120);
        } 
        else if (position.x >= 5) {
          setImageSrc("/images/gate-caa.jpg");
          resetPosition(player, 180);
        } 
        else if (position.x <= -5) {
          setImageSrc("/images/ced.jpg");
          resetPosition(player, 10);
        } 
        else if (position.z <= -5) {
          setImageSrc("/images/ced-hallway.jpg");
          resetPosition(player, 120);
        } 
      }

      if (imageSrc === "/images/ced.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/gate-ced.jpg");
          resetPosition(player, 10);
        }
      }
      //End of College of Education

      //College of Agriculture and Agri-Industries
      if (imageSrc === "/images/gate-caa.jpg") {
        if (position.z < -5) {
          setImageSrc("/images/inside-gate.jpg");
          resetPosition(player, 120);
        }
        else if (position.x >= 5) {
          setImageSrc("/images/gate-ced.jpg");
          resetPosition(player, 120);
        }
        else if (position.x <= -5) {
          setImageSrc("/images/caa-storage.jpg");
          resetPosition(player, 120);
        }
        else if (position.z >= 5) {
          setImageSrc("/images/ced-hallway.jpg");
          resetPosition(player, 120);
        } 
      }

      if (imageSrc === "/images/caa-storage.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/gate-caa.jpg");
          resetPosition(player, 120);
        }
        if (position.x <= -5) {
          setImageSrc("/images/caa.jpg");
          resetPosition(player, 120);
        }
      }

      if (imageSrc === "/images/caa.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/caa-storage.jpg");
          resetPosition(player, 120);
        }
        if (position.x <= -5) {
          setImageSrc("/images/caa-greenhouse.jpg");
          resetPosition(player, 120);
        }
      }
      //End of College of Agriculture and Agri-Industries

      if (imageSrc === "/images/caa-greenhouse.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/caa.jpg");
          resetPosition(player, 120);
        }
      }

      //Hallway
      if (imageSrc === "/images/ced-hallway.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/inside-gate.jpg");
          resetPosition(player, 80);
        } else if (position.x <=-5) {
          setImageSrc("/images/harrison-bridge.jpg");
          resetPosition(player, 95);
        }
      }

      //Harison Bridge
      if (imageSrc === "/images/harrison-bridge.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/ced-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.x <=-5) {
          setImageSrc("/images/exit-lib-hallway.jpg");
          resetPosition(player, 95);
        }
      }

      //Exit Library
      if (imageSrc === "/images/exit-lib-hallway.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/harrison-bridge.jpg");
          resetPosition(player, 95);
        } else if (position.x <= -5) {
          setImageSrc("/images/batok-hall-hallway.jpg");
          resetPosition(player, 95);
        } else if (position.z >= 5) {
          setImageSrc("/images/nsb-canteen.jpg");
          resetPosition(player, 120);
        }
      }

      //Batok Hall or NSB
      if (imageSrc === "/images/batok-hall-hallway.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/exit-lib-hallway.jpg");
          resetPosition(player, 95);
        } else if (position.x <= -5) {
          setImageSrc("/images/crossroad-hallway.jpg");
          resetPosition(player, 120);
        } 
      }

      //Crossroad Hallway
      if (imageSrc === "/images/crossroad-hallway.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/batok-hall-hallway.jpg");
          resetPosition(player, 95);
        } else if (position.x <= -3 && position.z >= 3) {
          setImageSrc("/images/admin-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.z >= 5) {
          setImageSrc("/images/beside-admin.jpg");
          resetPosition(player, 120);
        } else if (position.z <= -3 && position.x <= -3) {
          setImageSrc("/images/library-entrance.jpg");
          resetPosition(player, 140);
        }
      }

      //Library Entrance
      if (imageSrc === "/images/library-entrance.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/crossroad-hallway.jpg");
          resetPosition(player, 120);
        } else if (position.x <= -5) {
          setImageSrc("/images/oval-entrance.jpg");
          resetPosition(player, 80);
        }
      }

      //Oval Entrance
      if (imageSrc === "/images/oval-entrance.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/library-entrance.jpg");
          resetPosition(player, 20);
        } else if (position.x <= -5) {
          setImageSrc("/images/to-bookshop.jpg");
          resetPosition(player, 100);
        }
      }

      //Bookshop
      if (imageSrc === "/images/to-bookshop.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/oval-entrance.jpg");
          resetPosition(player, 80);
        } else if (position.x <= -5) {
          setImageSrc("/images/bookshop.jpg");
          resetPosition(player, 100);
        }
      }

      if (imageSrc === "/images/bookshop.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/to-bookshop.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/annex-3.jpg");
          resetPosition(player, 80);
        }
      }

      //Annex 3
      if (imageSrc === "/images/annex-3.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/bookshop.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/csu-gym.jpg");
          resetPosition(player, 80);
        }
      }

      //CSU Gym
      if (imageSrc === "/images/csu-gym.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/annex-3.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/sports-center.jpg");
          resetPosition(player, 80);
        }
      }

      //Sports Center
      if (imageSrc === "/images/sports-center.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/csu-gym.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/to-chapel.jpg");
          resetPosition(player, 80);
        }
      }

      //CSU Chapel
      if (imageSrc === "/images/to-chapel.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/sports-center.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/csu-chapel.jpg");
          resetPosition(player, 80);
        }
      }

      if (imageSrc === "/images/csu-chapel.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/to-chapel.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/cafeteria-crossroad.jpg");
          resetPosition(player, 80);
        }
      }

      //Beside Admin
      if (imageSrc === "/images/beside-admin.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/crossroad-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.x >= 5) {
          setImageSrc("/images/behind-nsb.jpg");
          resetPosition(player, 100);
        }
      }

      //New Admin Hallway
      if (imageSrc === "/images/admin-hallway.jpg") {
        if (position.x >= 3) {
          setImageSrc("/images/crossroad-hallway.jpg");
          resetPosition(player, 120);
        } else if (position.x <= -3) {
          setImageSrc("/images/registrar-hallway.jpg");
          resetPosition(player, 20);
        } else if (position.z >= 3) {
          setImageSrc("/images/admin.jpg");
          resetPosition(player, 20);
        }
      }

      if (imageSrc === "/images/admin.jpg") {
        if (position.z <= -3) {
          setImageSrc("/images/admin-hallway.jpg");
          resetPosition(player, 20);
        } else if (position.z >= 3) {
          setImageSrc("/images/admin2.jpg");
          resetPosition(player, 20);
        }
      }

      if (imageSrc === "/images/admin2.jpg") {
        if (position.z <= -3) {
          setImageSrc("/images/admin.jpg");
          resetPosition(player, 20);
        }
      }

      //Registrar Hallway
      if (imageSrc === "/images/registrar-hallway.jpg") {
        if (position.x >= 2) {
          setImageSrc("/images/admin-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.z <= -3) {
          setImageSrc("/images/old-admin-hallway.jpg");
          resetPosition(player, 5);
        } else if (position.x <= -3) {
          setImageSrc("/images/admission-office.jpg");
          resetPosition(player, -10);
        }
      }

      if (imageSrc === "/images/admission-office.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/registrar-hallway.jpg");
          resetPosition(player, 20);
        } else if (position.x <= -3) {
          setImageSrc("/images/registrar-office.jpg");
          resetPosition(player, -70);
        }
      }

      if (imageSrc === "/images/registrar-office.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/admission-office.jpg");
          resetPosition(player, 20);
        } else if (position.x <= -5) {
          setImageSrc("/images/cashier.jpg");
          resetPosition(player, 20);
        }
      }

      if (imageSrc === "/images/cashier.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/registrar-office.jpg");
          resetPosition(player, 20);
        }
      }

      //Old Admin Hallway
      if (imageSrc === "/images/old-admin-hallway.jpg") {
        if (position.z >= 3) {
          setImageSrc("/images/registrar-hallway.jpg");
          resetPosition(player, 20);
        } else if (position.z <= -5) {
          setImageSrc("/images/kinaadman-hallway.jpg");
          resetPosition(player, 5);
        } else if (position.x <= -5) {
          setImageSrc("/images/to-guidance-office.jpg");
          resetPosition(player, 10);
        }
      }

      if (imageSrc === "/images/to-guidance-office.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/old-admin-hallway.jpg");
          resetPosition(player, 20);
        } else if (position.x <= -5) {
          setImageSrc("/images/guidance-office.jpg");
          resetPosition(player, -10);
        }
      }

      if (imageSrc === "/images/guidance-office.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/to-guidance-office.jpg");
          resetPosition(player, 10);
        }
      }

      //Kinaadman Hallway 
      if (imageSrc === "/images/kinaadman-hallway.jpg") {
        if (position.x <= -3 && position.z >= 3) {
          setImageSrc("/images/old-admin-hallway.jpg");
          resetPosition(player, 20);
        } else if (position.x >= 3 && position.z <= -3) {
          setImageSrc("/images/cafeteria-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.z <= -3 && position.x <= -3) {
          setImageSrc("/images/kinaadman-hall.jpg");
          resetPosition(player, 5);
        } else if (position.z >= 3 && position.x >= 3) {
          setImageSrc("/images/cas-building.jpg");
          resetPosition(player, 5);
        }
      }

      //Kinaadman Hall
      if (imageSrc === "/images/kinaadman-hall.jpg") {
        if (position.z >= 5) {
          setImageSrc("/images/kinaadman-hallway.jpg");
          resetPosition(player, 5);
        }
      }

      //CAS Building
      if (imageSrc === "/images/cas-building.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/kinaadman-hallway.jpg");
          resetPosition(player, 5);
        } else if (position.x <= -5) {
          setImageSrc("/images/cas-building2.jpg");
          resetPosition(player, 20);
        }
      }

      if (imageSrc === "/images/cas-building2.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/cas-building.jpg");
          resetPosition(player, 20);
        }
      }

      //Cafeteria Hallway
      if (imageSrc === "/images/cafeteria-hallway.jpg") {
        if (position.z >= 5) {
          setImageSrc("/images/kinaadman-hallway.jpg");
          resetPosition(player, 5);
        } else if (position.z <= -5) {
          setImageSrc("/images/cafeteria-crossroad.jpg");
          resetPosition(player, 100);
        }
      }

      //Cafeteria Crossroad
      if (imageSrc === "/images/cafeteria-crossroad.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/cafeteria-hallway.jpg");
          resetPosition(player, 20);
        } else if (position.x >= 5) {
          setImageSrc("/images/hiraya-hallway.jpg");
          resetPosition(player, 10);
        }else if (position.z <= -5) {
          setImageSrc("/images/beside-hiraya.jpg");
          resetPosition(player, 100);
        } else if (position.z >= 5) {
          setImageSrc("/images/csu-chapel.jpg");
          resetPosition(player, 100);
        }
      }

      //Beside Hiraya Hall
      if (imageSrc === "/images/beside-hiraya.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/cafeteria-crossroad.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/masawa-crossroad.jpg");
          resetPosition(player, 100);
        }
      }

      //Hiraya Hall or CCIS Building
      if (imageSrc === "/images/hiraya-hallway.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/cafeteria-crossroad.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/eco-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.z >= 5) {
          setImageSrc("/images/hiraya-hall.jpg");
          resetPosition(player, -80);
        }
      }

      if (imageSrc === "/images/hiraya-hall.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/hiraya-hallway.jpg");
          resetPosition(player, 10);
        }
      }

      if (imageSrc === "/images/eco-hallway.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/hiraya-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/hinang-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.z <= -5) {
          setImageSrc("/images/eco-hall.jpg");
          resetPosition(player, 180);
        }
      }

      if (imageSrc === "/images/eco-hall.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/eco-hallway.jpg");
          resetPosition(player, 100);
        }
      }

      //Hinang Hall or CEGS Building
      if (imageSrc === "/images/hinang-hallway.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/eco-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/hinang-crossroad.jpg");
          resetPosition(player, 100);
        } else if (position.z >= 5) {
          setImageSrc("/images/hinang-hall.jpg");
          resetPosition(player, -10);
        }
      }

      if (imageSrc === "/images/hinang-hall.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/hinang-hallway.jpg");
          resetPosition(player, 10);
        }
      }

      //Hinang Crossroad
      if (imageSrc === "/images/hinang-crossroad.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/hinang-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/eco-bridge.jpg");
          resetPosition(player, 100);
        } else if (position.z >= 5) {
          setImageSrc("/images/annex-2.jpg");
          resetPosition(player, 100);
        }
      }

      //Eco Bridge
      if (imageSrc === "/images/eco-bridge.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/hinang-crossroad.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/pink-hallway.jpg");
          resetPosition(player, 100);
        } 
      }

      //Pink Room Hallway
      if (imageSrc === "/images/pink-hallway.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/eco-bridge.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/organic-training-center.jpg");
          resetPosition(player, 100);
        } 
      }

      //Organic Training Center
      if (imageSrc === "/images/organic-training-center.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/pink-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/dost-road.jpg");
          resetPosition(player, 100);
        } 
      }

      //DOST Road
      if (imageSrc === "/images/dost-road.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/organic-training-center.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/villares-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.z >= 5) {
          setImageSrc("/images/dost.jpg");
          resetPosition(player, 100);
        }
      }

      if (imageSrc === "/images/dost.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/dost-road.jpg");
          resetPosition(player, 100);
        }
      }

      //Villares Hallway
      if (imageSrc === "/images/villares-hallway.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/dost-road.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/microhaze-hallway.jpg");
          resetPosition(player, 100);
        } 
      }
      
      //Microhaze Hallway
      if (imageSrc === "/images/microhaze-hallway.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/villares-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/unfinished-building.jpg");
          resetPosition(player, 100);
        } 
      }

      //Unfinished Building
      if (imageSrc === "/images/unfinished-building.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/microhaze-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/rice-field.jpg");
          resetPosition(player, 100);
        } 
      }

      //Rice Field
      if (imageSrc === "/images/rice-field.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/unfinished-building.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/carabao-center.jpg");
          resetPosition(player, 100);
        } 
      }

      //Carabao Center
      if (imageSrc === "/images/carabao-center.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/rice-field.jpg");
          resetPosition(player, 100); 
        } else if (position.x <= -5) {
          setImageSrc("/images/farm-hallway.jpg");
          resetPosition(player, 100);
        }
      }

      //Farm Hallway
      if (imageSrc === "/images/farm-hallway.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/carabao-center.jpg");
          resetPosition(player, 100); 
        } else if (position.x <= -5) {
          setImageSrc("/images/underconstruction.jpg");
          resetPosition(player, 100);
        }
      }

      //Under Construction
      if (imageSrc === "/images/underconstruction.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/farm-hallway.jpg");
          resetPosition(player, 100); 
        } else if (position.x <= -5) {
          setImageSrc("/images/diversion-gate.jpg");
          resetPosition(player, 100);
        }
      }
      
      //Diversion Gate
      if (imageSrc === "/images/diversion-gate.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/underconstruction.jpg");
          resetPosition(player, 100); 
        }
      }
      //End of Hallway

      //Start of NSB
      if (imageSrc === "/images/nsb-canteen.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/exit-lib-hallway.jpg");
          resetPosition(player, 100);
        } else if (position.x >= 5) {
          setImageSrc("/images/hostel.jpg");
          resetPosition(player, 100);
        }
      }

      if (imageSrc === "/images/hostel.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/nsb-canteen.jpg");
          resetPosition(player, 100);
        } else if (position.x >= 5) {
          setImageSrc("/images/presidents-house.jpg");
          resetPosition(player, 100);
        }
      }

      if (imageSrc === "/images/presidents-house.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/hostel.jpg");
          resetPosition(player, 100);
        } else if (position.x >= 5) {
          setImageSrc("/images/behind-nsb.jpg");
          resetPosition(player, 100);
        }
      }

      if (imageSrc === "/images/behind-nsb.jpg") {
        if (position.z <= -5) {
          setImageSrc("/images/presidents-house.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/beside-admin.jpg");
          resetPosition(player, 100);
        } else if (position.z >= 5) {
          setImageSrc("/images/drrm.jpg");
          resetPosition(player, 100);
        }
      }
      //End of NSB

      //Behind Administration Building
      if (imageSrc === "/images/drrm.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/behind-nsb.jpg");
          resetPosition(player, 100);
        } else if (position.x >= 5) {
          setImageSrc("/images/greengate-road.jpg");
          resetPosition(player, 100);
        }
      }

      if (imageSrc === "/images/greengate-road.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/drrm.jpg");
          resetPosition(player, 100);
        } else if (position.x >= 5) {
          setImageSrc("/images/behind-kinaadman.jpg");
          resetPosition(player, 100);
        } else if (position.z <= -5) {
          setImageSrc("/images/motorpool.jpg");
          resetPosition(player, 180);
        }
      }

      if (imageSrc === "/images/motorpool.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/greengate-road.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/greengate.jpg");
          resetPosition(player, -170);
        }
      }

      if (imageSrc === "/images/greengate.jpg") {
        if (position.x >= 5) {
          setImageSrc("/images/motorpool.jpg");
          resetPosition(player, 100);
        } else if (position.x <= -5) {
          setImageSrc("/images/outside-greengate.jpg");
          resetPosition(player, 100);
        }
      }

      if (imageSrc === "/images/outside-greengate.jpg") {
        if (position.z >= 5) {
          setImageSrc("/images/greengate.jpg");
          resetPosition(player, 100);
        }
      }
      //End of Behind Administration Building

      //Start of Behind Kinaadman
      if (imageSrc === "/images/behind-kinaadman.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/greengate-road.jpg");
          resetPosition(player, 100);
        } else if (position.x >= 5) {
          setImageSrc("/images/masawa-crossroad.jpg");
          resetPosition(player, 100);
        }
      }
      //End of Behind Kinaadman

      //Start of Masawa
      if (imageSrc === "/images/masawa-crossroad.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/behind-kinaadman.jpg");
          resetPosition(player, 100);
        } else if (position.x >= 5) {
          setImageSrc("/images/masawa-hall.jpg");
          resetPosition(player, 100);
        } else if (position.z >= 5) {
          setImageSrc("/images/beside-hiraya.jpg");
          resetPosition(player, 100);
        }
      }

      if (imageSrc === "/images/masawa-hall.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/masawa-crossroad.jpg");
          resetPosition(player, 100);
        } else if (position.x >= 5) {
          setImageSrc("/images/behind-hinang.jpg");
          resetPosition(player, 100);
        } 
      }
      //End of Masawa

      //Start of Behind Hinang
      if (imageSrc === "/images/behind-hinang.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/masawa-hall.jpg");
          resetPosition(player, 100);
        } else if (position.x >= 5) {
          setImageSrc("/images/annex-2.jpg");
          resetPosition(player, 100);
        }
      }

      if (imageSrc === "/images/annex-2.jpg") {
        if (position.x <= -5) {
          setImageSrc("/images/behind-hinang.jpg");
          resetPosition(player, 100);
        } else if (position.x >= 5) {
          setImageSrc("/images/hinang-crossroad.jpg");
          resetPosition(player, 100);
        }
      }
    };

    const interval = setInterval(checkPosition, 100);
    return () => clearInterval(interval);
  }, [imageSrc]);

  useEffect(() => {
    const interactiveElements = document.querySelectorAll(".hotspot");

    interactiveElements.forEach((element) => {
      element.addEventListener("click", handleTap);
    });

    return () => {
      interactiveElements.forEach((element) => {
        element.removeEventListener("click", handleTap);
      });
    };
  }, []);

  const handleTap = (event) => {
    const currentTime = new Date().getTime();
    const tapGap = currentTime - lastTapRef.current;

    if (tapGap < 300 && tapGap > 50) {
      // Double tap detected
      const newImageSrc = event.target.getAttribute("data-image");
      setImageSrc(newImageSrc);
    }

    lastTapRef.current = currentTime;
  };

  return (
    <div className="relative w-full h-screen">
      <button onClick={handleBack} className="absolute top-14 left-6 p-4 rounded-full shadow-slate-800 shadow-md flex bg-white z-50">
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      {/* A-Frame Scene */}
      <a-scene className="absolute inset-0">
        <a-sky src={imageSrc}></a-sky>

        <a-entity
          id="rig"
          position="0 1.6 0"
          movement-controls="fly: false"
          rotation="0 90 0"
        >
          <a-entity camera look-controls wasd-controls="acceleration: 120" animation="property: position; from: 0 1.6 0; to: 5 1.6 -5; dur: 5000; easing: linear; loop: true">
            {/* Custom Cursor */}
            <a-entity
              id="cursor"
              position="0 0 -1"
              geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
              material="color: white; shader: flat"
            ></a-entity>
          </a-entity>
        </a-entity>

        //Outside Main Gate
        {imageSrc === "/images/gate.jpg" && (
          <a-entity
          className="hotspot"
          geometry="primitive: plane; height: 55; width: 190"
          material="color: green; opacity: 0.5"
          position="-290 -0.9 10"
          rotation="0 90 0"
          data-image="/images/inside-gate.jpg"
          >
            <a-text
              value="Welcome to Caraga State University!"
              align="center"
              color="white"
              width="150"
              wrap-count="20"
              position="0 0 0.1"
            ></a-text>
          </a-entity>
        )}
        
        //Inside Main Gate
        {imageSrc === "/images/inside-gate.jpg" && (
          <a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: red; opacity: 0.5"
            position="290 -0.9 -0.9"
            rotation="0 -90 0"
            data-image="/images/inside-gate.jpg"
            >
              <a-text
                value="Thank you for visiting Caraga State University!"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: green; opacity: 0.5"
            position="-300 -0.9 -300"
            rotation="0 40 0"
            data-image="/images/inside-gate.jpg"
            >
              <a-text
                value="This way to the College of Agriculture and Agri-Industries!"
                align="center"
                color="white"
                width="160"
                wrap-count="25"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: green; opacity: 0.5"
            position="-170 -0.9 300"
            rotation="0 -210 0"
            data-image="/images/inside-gate.jpg"
            >
              <a-text
                value="This way to the College of Education!"
                align="center"
                color="white"
                width="160"
                wrap-count="25"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
          </a-entity>
        )}
        
        //College of Education
        {imageSrc === "/images/gate-ced.jpg" && (
          <a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: red; opacity: 0.5"
            position="300 -0.9 300"
            rotation="0 -130 0"
            data-image="/images/inside-gate.jpg"
            >
              <a-text
                value="This way to the Main Gate!"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: green; opacity: 0.5"
            position="400 -0.9 -90.9"
            rotation="0 -90 0"
            data-image="/images/inside-gate.jpg"
            >
              <a-text
                value="This way to the College of Agriculture and Agri-Industries!"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: green; opacity: 0.5"
            position="-400 -0.9 70"
            rotation="0 90 0"
            data-image="/images/inside-gate.jpg"
            >
              <a-text
                value="Welcome to the College of Education!"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
          </a-entity>
        )}

        {imageSrc === "/images/ced.jpg" && (
          <a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: green; opacity: 0.5"
            position="400 -0.9 70"
            rotation="0 -90 0"
            data-image="/images/inside-gate.jpg"
            >
              <a-text
                value="Back to the Hallway"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
          </a-entity>
        )}

        //College of Agriculture and Agri-Industries
        {imageSrc === "/images/gate-caa.jpg" && (
          <a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: red; opacity: 0.5"
            position="200 -0.9 -260"
            rotation="0 -50 0"
            data-image="/images/inside-gate.jpg"
            >
              <a-text
                value="This way to Main Gate."
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
            <a-entity
              className="hotspot"
              geometry="primitive: plane; height: 55; width: 190"
              material="color: green; opacity: 0.5"
              position="380 -0.9 150"
              rotation="0 -100 0"
              data-image="/images/inside-gate.jpg"
              >
              <a-text
                value="This way to the College of Education!"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: green; opacity: 0.5"
            position="-340 -0.9 -60"
            rotation="0 60 0"
            >
              <a-text
                value="This way to the College of Agriculture and Agri-Industries!"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
          </a-entity>
        )}

        {imageSrc === "/images/caa-storage.jpg" && (
          <a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: green; opacity: 0.5"
            position="-340 -0.9 -60"
            rotation="0 60 0"
            >
              <a-text
                value="Welcome to the College of Agriculture and Agri-Industries!"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: green; opacity: 0.5"
            position="-140 60 320"
            rotation="0 150 0"
            >
              <a-text
                value="CAA Storage"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
            <a-entity
              className="hotspot"
              geometry="primitive: plane; height: 55; width: 190"
              material="color: green; opacity: 0.5"
              position="280 -0.9 150"
              rotation="0 -100 0"
              data-image="/images/inside-gate.jpg"
              >
              <a-text
                value="Back to the Hallway!"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
          </a-entity>
        )}

        {imageSrc === "/images/caa.jpg" && (
          <a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: green; opacity: 0.5"
            position="-20 30 320"
            rotation="0 180 0"
            >
              <a-text
                value="CAA Canteen"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: green; opacity: 0.5"
            position="-340 -0.9 -150"
            rotation="0 60 0"
            >
              <a-text
                value="This way to CAA Greenhouse!"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
            <a-entity
              className="hotspot"
              geometry="primitive: plane; height: 55; width: 190"
              material="color: green; opacity: 0.5"
              position="380 -0.9 150"
              rotation="0 -100 0"
              data-image="/images/inside-gate.jpg"
              >
              <a-text
                value="Back to the Hallway!"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
          </a-entity>
        )}

        {imageSrc === "/images/caa-greenhouse.jpg" && (
          <a-entity>
            <a-entity
            className="hotspot"
            geometry="primitive: plane; height: 55; width: 190"
            material="color: green; opacity: 0.5"
            position="-450 -0.9 -150"
            rotation="0 70 0"
            >
              <a-text
                value="CAA Greenhouse!"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
            <a-entity
              className="hotspot"
              geometry="primitive: plane; height: 55; width: 190"
              material="color: green; opacity: 0.5"
              position="380 -0.9 150"
              rotation="0 -100 0"
              data-image="/images/inside-gate.jpg"
              >
              <a-text
                value="Back to the College of Agriculture and Agri-Industries!"
                align="center"
                color="white"
                width="150"
                wrap-count="20"
                position="0 0 0.1"
              ></a-text>
            </a-entity>
          </a-entity>
        )}

        {/* Interactive Hotspots */}
        {/* <a-entity
          className="hotspot"
          geometry="primitive: plane; height: 1; width: 1"
          material="color: transparent; opacity: 0"
          position="-1 1.6 -3"
          data-image="/images/gate-ced.jpg"
        ></a-entity>

        <a-entity
          className="hotspot"
          geometry="primitive: plane; height: 1; width: 1"
          material="color: transparent; opacity: 0"
          position="1 1.6 -3"
          data-image="/images/gate-caa.jpg"
        ></a-entity> */}
      </a-scene>
    </div>
  );
};

// Reset player position when transitioning between scenes
const resetPosition = (player, rotationY) => {
  player.setAttribute("position", { x: 0, y: 1.6, z: 0 });
  player.setAttribute("rotation", { x: 0, y: rotationY, z: 0 });
};

export default TourScreen;
