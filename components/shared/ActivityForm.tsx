"use client"
import Link from "next/link"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CustomField } from "./CustomField"
import { Button } from "../ui/button"
import MediaUploader from "./MediaUploader"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { activityTypes, aspectRatioOptions, defaultValues } from "@/constants"
import { useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"

export const formSchema = z.object({
    title: z.string(),
    aspectRatio: z.string().optional(),
    color: z.string().optional(),
    publicId: z.string(),

})

const ActivityForm = ({ action, data = null, userId, type, creditBalance, config = null }: ActivityFormProps) => {

    const activityType = activityTypes[type]
    const [image, setImage] = useState(data)
    const [newActivity, setNewActivity] = useState(null)
    const [tranformationConfig, setTranformationConfig] = useState(config)
    const [isTransforming, setIsTransforming] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isPending, startActivity] = useTransition()


    const initialValues = data && action === 'update' ? {
        title: data?.title,
        aspectRatio: data?.aspectRatio,
        color: data?.color,
        prompt: data?.prompt,
        publicId: data?.publicId,
    } : defaultValues
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues
    })

    function onSubmit(values: z.infer<typeof formSchema>) {

    }

    const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
        const imageSize = aspectRatioOptions[value as AspectRatioKey]

        setImage((prevState) => ({
            ...prevState,
            aspectRatio: imageSize.aspectRatio,
            width: imageSize.width,
            height: imageSize.height,

        }))

        setNewActivity(activityType.config)

        return onChangeField(value)
    }

    const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField: (value: string) =>
        void) => {
        debounce(() => {
            setNewActivity((prevState: any) => ({
                ...prevState,
                [type]: {
                    ...prevState?.[type],
                    [fieldName === 'prompt' ? 'prompt' : 'to']:
                        value
                }
            }))

            return onChangeField(value)
        }, 1000)

    }

    const onActivityHandler = async () => {
        setIsTransforming(true)

        deepMergeObjects(newActivity, tranformationConfig)

        setNewActivity(null)
        startActivity(async () => {
            // await updateCredits(userId, creditFee)
        })
    }
    return (
        <div className="form-container">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CustomField
                        control={form.control}
                        name="title"
                        formLabel="Image title"
                        className="w-full"
                        render={({ field }) => <Input{...field} className="input-field" />}
                    />
                    {type === 'fill' && (
                        <CustomField
                            control={form.control}
                            name="aspectRatio"
                            formLabel="Aspect Ratio"
                            className="w-full"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(val) => onSelectFieldHandler(val, field.onChange)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Size" />
                                    </SelectTrigger>
                                    <SelectContent className="helloworld">
                                        {Object.keys(aspectRatioOptions).map((key) => (
                                            <SelectItem key={key} value={key} className="select-item">
                                                {aspectRatioOptions[key as AspectRatioKey].label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                            )} />
                    )}

                    {(type === "remove" || type === 'recolor') && (
                        <div className="prompt-field">
                            <CustomField control={form.control}
                                name="prompt"
                                formLabel={
                                    type === 'remove' ? 'Object To Remove' : 'Object to recolor'
                                }
                                className="w-full"
                                render={(({ field }) => (
                                    <Input
                                        value={field.value}
                                        className="input-field"
                                        onChange={(e) => onInputChangeHandler(
                                            'prompt',
                                            e.target.value,
                                            type,
                                            field.onChange
                                        )}
                                    />
                                ))}
                            />

                            {type === 'recolor' && (
                                <CustomField
                                    control={form.control}
                                    name='color'
                                    formLabel='Replacement color'
                                    className='w-full'
                                    render={({ field }) => (
                                        <Input
                                            value={field.value}
                                            className="input-field"
                                            onChange={(e) => onInputChangeHandler(
                                                'prompt',
                                                e.target.value,
                                                type,
                                                field.onChange
                                            )}
                                        />
                                    )}
                                />
                            )}
                        </div>
                    )}

                            <div className="media-uploader-field">
          <CustomField 
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader 
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />
        </div>
                    <div className="flex flex-col gap-4">
                        <Button className="submit-button capitalize" type='button' disabled={isTransforming || newActivity === null}
                            onClick={onActivityHandler}
                        >

                            {isTransforming ? 'Transforming...' : 'Apply Transformation'}
                        </Button>
                        <Button className="submit-button capitalize" type='submit' disabled={isSubmitting}>

                            {isSubmitting ? 'Submitting...' : 'Save Image'}
                        </Button>
                    </div>



                </form>
            </Form>
        </div>
    )
}

export default ActivityForm