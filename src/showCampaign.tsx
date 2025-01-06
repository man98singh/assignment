import axios from "axios";
import "./components/css/showCampaign.css";
import { useEffect, useState } from "react";
import { DateRange } from "./components/dateRange";

// export const ShowCampaign = () => {
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingCampaignId, setEditingCampaignId] = useState(null);

//   const fetchCampaigns = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/campaigns"
//       );
//       setCampaigns(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError("Error fetching the campaigns");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   const handleEditCancel = () => {
//     setEditingCampaignId(null);
//     fetchCampaigns(); // Refresh the campaign list
//   };
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:3000/campaigns/${id}`);
//       fetchCampaigns();
//     } catch (err) {
//       setError("Error deleting campaign");
//     }
//   };
//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       <h1>Campaigns</h1>
//       <div>
//         {campaigns.map((campaign) => (
//           <div key={campaign.id} className="show-main">
//             {editingCampaignId === campaign.id ? (
//               <DateRange
//                 isEdit={true}
//                 campaignData={campaign}
//                 onCancel={handleEditCancel}
//               />
//             ) : (
//               <>
//                 <div>Type: {campaign.type}</div>
//                 <div>
//                   Next Schedule:{" "}
//                   {campaign.next_schedule?.weekday || "N/A"}
//                 </div>
//                 <div>
//                   Start Date:{" "}
//                   {new Date(campaign.start_date).toLocaleDateString()}
//                 </div>
//                 <div>
//                   End Date:{" "}
//                   {new Date(campaign.end_date).toLocaleDateString()}
//                 </div>
//                 <button
//                   onClick={() => setEditingCampaignId(campaign.id)}
//                 >
//                   Edit
//                 </button>
//                 <button onClick={() => handleDelete(campaign.id)}>
//                   Delete
//                 </button>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
interface Campaign {
  id: number;
  type: string;
  start_date: string;
  end_date: string;
  next_schedule: {
    date: string;
    weekday: string;
    start_time: string;
    end_time: string;
  };
}

export const ShowCampaign = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCampaignId, setEditingCampaignId] = useState<
    number | null
  >(null);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/campaigns"
      );
      setCampaigns(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching campaigns");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleEditCancel = () => {
    setEditingCampaignId(null);
    fetchCampaigns();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Campaigns</h1>
      <div>
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="show-main">
            {editingCampaignId === campaign.id ? (
              <DateRange
                isEdit={true}
                campaignData={campaign}
                onCancel={handleEditCancel}
              />
            ) : (
              <>
                <div>Type: {campaign.type}</div>
                <div>
                  Next Schedule:{" "}
                  {campaign.next_schedule?.weekday || "N/A"}
                  {campaign.next_schedule && (
                    <span>
                      {" "}
                      ({campaign.next_schedule.start_time} -{" "}
                      {campaign.next_schedule.end_time})
                    </span>
                  )}
                </div>
                <div>
                  Start Date:{" "}
                  {new Date(campaign.start_date).toLocaleDateString()}
                </div>
                <div>
                  End Date:{" "}
                  {new Date(campaign.end_date).toLocaleDateString()}
                </div>
                <button
                  onClick={() => setEditingCampaignId(campaign.id)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
