import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Upload,
  Breadcrumb,
  Space,
  Popconfirm,
  Skeleton,
  message,
  UploadFile,
  notification,
  Progress
} from "antd";
import { RevPub } from "@revpub/api";
import { User, ImageUploadParams } from "@revpub/types";
import ImgCrop from "antd-img-crop";
import { UploadChangeParam } from "antd/es/upload";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { getCurrentUserAvatarUrl } from "../util";


interface ProfileFormValues {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

const MyAccount = () => {
  const navigate = useNavigate();

  const MAX_AVATAR_IMAGE_SIZE: number = parseInt(
    import.meta.env.VITE_MAX_AVATAR_IMAGE_SIZE as string,
    10
  );

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>();

  const [defaultFileList, setDefaultFileList] = useState<UploadFile[]>([]);
  const [progress, setProgress] = useState(0);

  const openErrorNotification = (options: any) => {
    const { message, description } = options;
    notification.error({
      message: message,
      description: description,
    });
  };

  const updateAvatarUrl = (avatarUrl: string) => {
    RevPub.User.updateCurrentUser(
      {
        avatarUrl: avatarUrl,
      },
      () => {
        localStorage.setItem("user-avatar-url", avatarUrl);
      },
      () => {
        console.log("Avatar URL failed to update");
      }
    );
  };

  const handleOnChange = (params: UploadChangeParam) => {
    const { fileList } = params;
    setDefaultFileList(fileList);
  };

  const beforeUpload = (file: File) => {
    const isAllowedFormat =
      file.type === "image/jpeg" || file.type === "image/png";
    if (!isAllowedFormat) {
      message.error("Avatar image must be JPG or PNG format");
    }

    const isAllowedSize = file.size < MAX_AVATAR_IMAGE_SIZE;
    if (!isAllowedSize) {
      message.error("Avatar image must be smaller than 5 MB");
    }

    return isAllowedFormat && isAllowedSize;
  };

  const onImageUploadSuccess = (fileName: string, onSuccess: any) => {
    updateAvatarUrl(fileName);
    if (onSuccess !== undefined) {
      onSuccess("Ok");
    }
  };

  const onSignedURLSuccess = (
    imageUploadParams: ImageUploadParams,
    imageBlob: Blob,
    options: UploadRequestOption
  ) => {
    const { onSuccess, onProgress } = options;
    RevPub.Image.uploadImage(
      imageUploadParams,
      imageBlob,
      (event: any) => {
        if (onProgress !== undefined) {
          const percent = Math.floor((event.loaded / event.total) * 100);
          setProgress(percent);
          if (percent === 100) {
            setTimeout(() => setProgress(0), 1000);
          }
          onProgress({ percent: (event.loaded / event.total) * 100 });
        }
      },
      () => {
        onImageUploadSuccess(imageUploadParams.fileName, onSuccess);
      },
      () => {
        openErrorNotification({
          message: "Unable to Upload",
          description:
            "Could not upload the avatar image you have chosen at this time",
        });
      }
    );
  };

  const handleUpload = async (options: UploadRequestOption) => {
    const { onError } = options;
    const file = options.file as UploadFile;

    // Make sure image file is not too large
    if (file.size !== undefined) {
      if (file.size >= MAX_AVATAR_IMAGE_SIZE) {
        if (onError !== undefined) {
          onError(new Error("Image file is too large"));
        }
        return;
      }
    }

    const fileType = file.type;
    if (fileType === undefined) {
      return;
    }

    const bucketName = import.meta.env.VITE_BUCKET_NAME;
    if (bucketName === undefined) {
      return;
    }

    const userId = localStorage.getItem("user-id");
    if (userId === null) {
      return;
    }

    const imageBlob = await RevPub.Image.resizeImage(
      file as unknown as File,
      100,
      100
    );
    // const imageBlob: Blob = file as unknown as Blob;
    if (imageBlob === null) {
      return;
    }

    RevPub.Image.getAvatarPutURL(
      userId,
      {
        bucketName: bucketName,
        fileType: fileType,
      },
      (data) => {
        if (data.fileName === undefined) {
          return;
        }
        if (data.signedUrl === undefined) {
          return;
        }
        onSignedURLSuccess(
          {
            fileType: fileType,
            fileName: data.fileName,
            signedUrl: data.signedUrl,
          },
          imageBlob,
          options
        );
      },
      () => {}
    );
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
      if (src !== undefined) {
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
      }
    }
  };

  const onRemoveAvatar = async (file: UploadFile) => {
    RevPub.User.deleteCurrentUserAvatar(
      () => {
        localStorage.removeItem("user-avatar-url");
      },
      () => {
        console.log("failure");
      }
    );
  };

  const onFinish = (values: ProfileFormValues) => {
    RevPub.User.updateCurrentUser(
      {
        username: values.username,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName
      },
      (data) => {
        navigate("/");
      },
      () => {
        alert("Unable to update user.");
      }
    );
  };

  const onFinishFailed = (errorInfo: {}) => {
    console.log("Failed:", errorInfo);
  };

  const onDelete = () => {
    RevPub.User.deleteCurrentUser(
      () => {
        const refreshToken = localStorage.getItem("refresh-token");
        if (refreshToken === null) {
          return;
        }
        RevPub.Auth.logout(
          refreshToken,
          () => {
            localStorage.clear();
            navigate("/auth/login");
          },
          () => {
            alert("Unable to logout. Please try after some time.");
          }
        );
      },
      () => {
        alert("Unable to delete user.");
      }
    );
  };

  useEffect(() => {
    RevPub.User.getCurrentUser(
      (data) => {
        setUser(data);
        console.log(data.avatarUrl);
        if (data.avatarUrl !== null) {
          setDefaultFileList([
            {
              uid: '-1',
              name: getCurrentUserAvatarUrl(),
              status: 'done',
              url: RevPub.Image.getFullImagePath(getCurrentUserAvatarUrl()),
            },
          ])
        }
        setIsLoading(false);
      },
      () => {
        alert("Unable to get user.");
      }
    );
  }, []);

  return (
    <React.Fragment>
      <Breadcrumb
        items={[
          {
            title: (
              <Link to={"/"}>
                <HomeOutlined />
              </Link>
            ),
          },
          {
            title: "My Account",
          },
        ]}
      />
      <h1>My Account</h1>
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <Form
          name="updateMyAccountForm"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={user}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >

          <Form.Item label="Avatar" name="avatar">
            <ImgCrop>
              <Upload
                accept="image/*"
                listType="picture-circle"
                // fileList={fileList}
                defaultFileList={defaultFileList}
                showUploadList={{
                  showDownloadIcon: false,
                  showPreviewIcon: true,
                  showRemoveIcon: true,
                }}
                customRequest={handleUpload}
                beforeUpload={beforeUpload}
                onChange={handleOnChange}
                onPreview={onPreview}
                onRemove={onRemoveAvatar}
              >
                {defaultFileList.length === 0 && "+ Upload"}
              </Upload>
            </ImgCrop>
          </Form.Item>
          {progress > 0 ? <Progress percent={progress} /> : null}

          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "You must provide a username",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Email Address" name="email">
            <Input />
          </Form.Item>

          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              {
                required: true,
                message: "You must provide your first name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              {
                required: true,
                message: "You must provide your last name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Space direction="horizontal">
              <Button type="primary" htmlType="submit">
                Update My Account
              </Button>
              <Popconfirm
                title="Delete Your Account"
                description="Are you sure you want to delete your account? All your items, services, and skills will also be deleted. This cannot be undone."
                onConfirm={onDelete}
                okText="Yes, Delete My Account"
                cancelText="No, Don't Delete"
              >
                <Button type="primary" htmlType="button" danger>
                  Delete My Account
                </Button>
              </Popconfirm>
            </Space>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};
export default MyAccount;
