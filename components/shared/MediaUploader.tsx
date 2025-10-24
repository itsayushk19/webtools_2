import { toast } from "sonner"
import {CldUploadWidget} from "next-cloudinary"

const MediaUploader = ({
    onValueChange,
    setImage,
    image, publicId,
    type
}) => {
    const onUploadSuccessHandler = (result: any) => {

    }
    const onUploadErrorHandler = (result: any) => {
        toast.error("Event has not been created")
    }
  return (
    <CldUploadWidget
    uploadPreset='webtools'
    options={{
        multiple: false,
        resourceType: "image",

    }}

    onSuccess={onUploadSuccessHandler}
    onError={onUploadErrorHandler}
    >

        {({open}) =>(
            <div className="flex flex-col gap-4">
                <h3 className="h3-bold text-dark-600"></h3>

                {publicId}
            </div>
        )}
        
    </CldUploadWidget>
  )
}

export default MediaUploader
