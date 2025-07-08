import { useState, useEffect } from "react";
import { X, CheckCircle, Clock, CreditCard, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingStep {
  id: string;
  message: string;
  status: "pending" | "processing" | "completed";
  delay: number;
}

interface BookingSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: {
    id: string;
    name: string;
    location: string;
    price: number;
    image?: string;
  };
}

export default function BookingSidebar({ isOpen, onClose, hotel }: BookingSidebarProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<BookingStep[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  const initialSteps: BookingStep[] = [
    { id: "init", message: "Initiating booking process...", status: "pending", delay: 800 },
    { id: "check", message: "Checking available rooms for your dates...", status: "pending", delay: 1200 },
    { id: "pricing", message: "Verifying pricing and availability...", status: "pending", delay: 1000 },
    { id: "contact", message: "Contacting hotel reservation system...", status: "pending", delay: 1500 },
    { id: "budget", message: "Finding budget-accurate costs...", status: "pending", delay: 900 },
    { id: "secure", message: "Securing your preferred room type...", status: "pending", delay: 1100 },
    { id: "payment", message: "Processing payment authorization...", status: "pending", delay: 1300 },
    { id: "finalize", message: "Finalizing reservation details...", status: "pending", delay: 800 },
    { id: "confirm", message: "Generating confirmation number...", status: "pending", delay: 700 },
    { id: "email", message: "Sending confirmation email...", status: "pending", delay: 600 },
    { id: "complete", message: "Booking complete!", status: "pending", delay: 500 }
  ];

  useEffect(() => {
    if (isOpen && steps.length === 0) {
      setSteps([...initialSteps]);
      setCurrentStep(0);
      setIsComplete(false);
      startBookingProcess();
    }
  }, [isOpen]);

  const startBookingProcess = async () => {
    for (let i = 0; i < initialSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, initialSteps[i].delay));
      
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index < i ? "completed" : index === i ? "processing" : "pending"
      })));
      setCurrentStep(i);

      // Complete the step after a brief processing time
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index <= i ? "completed" : "pending"
      })));
    }

    // Generate mock confirmation data
    const confirmation = {
      confirmationNumber: `HTL${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      checkOut: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      roomType: "Deluxe King Room",
      guests: 2,
      totalPrice: hotel.price * 2,
      bookingDate: new Date().toLocaleDateString()
    };

    setConfirmationData(confirmation);
    setIsComplete(true);
  };

  const resetBooking = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsComplete(false);
    setConfirmationData(null);
  };

  const handleClose = () => {
    resetBooking();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 z-40 transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-screen w-[55vw] min-w-[550px] bg-[#171717] border-l border-gray-600 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Booking {hotel.name}</h2>
            <Button variant="ghost" size="sm" onClick={handleClose} className="hover:bg-gray-800">
              <X className="h-5 w-5 text-gray-400" />
            </Button>
          </div>

          {/* Hotel Info */}
          <div className="p-8 border-b border-gray-700">
            <div className="flex items-start space-x-6">
              {hotel.image && (
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-20 h-16 object-cover rounded-lg shadow-md"
                />
              )}
              <div>
                <h3 className="font-semibold text-white text-lg">{hotel.name}</h3>
                <p className="text-gray-400 flex items-center mt-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  {hotel.location}
                </p>
                <p className="text-green-400 font-semibold mt-2">${hotel.price}/night</p>
              </div>
            </div>
          </div>

          {/* Booking Process */}
          <div className="flex-1 overflow-y-auto p-8">
            {!isComplete ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-6">Booking Progress</h3>
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === "completed" ? "bg-green-500" :
                      step.status === "processing" ? "bg-blue-500" : "bg-gray-600"
                    }`}>
                      {step.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : step.status === "processing" ? (
                        <Clock className="h-5 w-5 text-white animate-spin" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                      )}
                    </div>
                    <span className={`text-base ${
                      step.status === "completed" ? "text-green-400" :
                      step.status === "processing" ? "text-blue-400" : "text-gray-500"
                    }`}>
                      {step.message}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Success Message */}
                <div className="text-center p-8 bg-green-500/10 rounded-xl border border-green-500/20">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-3">Booking Confirmed!</h3>
                  <p className="text-gray-400">Your reservation has been successfully processed</p>
                </div>

                {/* Confirmation Details */}
                {confirmationData && (
                  <div className="space-y-6">
                    <h4 className="font-semibold text-white text-lg">Reservation Details</h4>
                    
                    <div className="grid grid-cols-2 gap-6 text-base">
                      <div>
                        <span className="text-gray-400 text-sm">Confirmation #</span>
                        <p className="text-white font-mono text-lg">{confirmationData.confirmationNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Total Price</span>
                        <p className="text-white text-lg font-semibold">${confirmationData.totalPrice}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Check-in</span>
                        <p className="text-white">{confirmationData.checkIn}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Check-out</span>
                        <p className="text-white">{confirmationData.checkOut}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Room Type</span>
                        <p className="text-white">{confirmationData.roomType}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Guests</span>
                        <p className="text-white">{confirmationData.guests}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-700">
                      <p className="text-sm text-gray-500">
                        Booked on {confirmationData.bookingDate} • Confirmation email sent
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-4 pt-6">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base">
                    <Calendar className="h-5 w-5 mr-2" />
                    Add to Calendar
                  </Button>
                  <Button variant="outline" className="w-full h-12 text-base" onClick={() => {
                    navigator.clipboard.writeText(confirmationData?.confirmationNumber || '');
                  }}>
                    Copy Confirmation Number
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}